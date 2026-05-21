/**
 * A 100% Local, Pure JavaScript QR Code Generator.
 * This implementation generates a real, scannable QR code locally
 * to bypass AdBlockers and CORS restrictions entirely.
 */

// --- Mini QR Code Engine (Kazuhiko Arase implementation) ---
const QRGenerator = (function() {
    function QRCode(typeNumber, errorCorrectLevel) {
        this.typeNumber = typeNumber;
        this.errorCorrectLevel = errorCorrectLevel;
        this.modules = null;
        this.moduleCount = 0;
        this.dataCache = null;
        this.dataList = [];
    }
    QRCode.prototype = {
        addData: function(data) { this.dataList.push(new QR8bitByte(data)); this.dataCache = null; },
        isDark: function(row, col) { return this.modules[row][col]; },
        getModuleCount: function() { return this.moduleCount; },
        make: function() { this.makeImpl(false, this.getBestMaskPattern()); },
        makeImpl: function(test, maskPattern) {
            this.moduleCount = this.typeNumber * 4 + 17;
            this.modules = new Array(this.moduleCount);
            for (var row = 0; row < this.moduleCount; row++) {
                this.modules[row] = new Array(this.moduleCount);
                for (var col = 0; col < this.moduleCount; col++) this.modules[row][col] = null;
            }
            this.setupPositionProbePattern(0, 0);
            this.setupPositionProbePattern(this.moduleCount - 7, 0);
            this.setupPositionProbePattern(0, this.moduleCount - 7);
            this.setupPositionAdjustPattern();
            this.setupTimingPattern();
            this.setupTypeInfo(test, maskPattern);
            if (this.typeNumber >= 7) this.setupTypeNumber(test);
            if (this.dataCache == null) this.dataCache = QRCode.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
            this.mapData(this.dataCache, maskPattern);
        },
        setupPositionProbePattern: function(row, col) {
            for (var r = -1; r <= 7; r++) {
                if (row + r <= -1 || this.moduleCount <= row + r) continue;
                for (var c = -1; c <= 7; c++) {
                    if (col + c <= -1 || this.moduleCount <= col + c) continue;
                    if ((0 <= r && r <= 6 && (c == 0 || c == 6)) || (0 <= c && c <= 6 && (r == 0 || r == 6)) || (2 <= r && r <= 4 && 2 <= c && c <= 4)) this.modules[row + r][col + c] = true;
                    else this.modules[row + r][col + c] = false;
                }
            }
        },
        getBestMaskPattern: function() { return 0; },
        setupTimingPattern: function() {
            for (var r = 8; r < this.moduleCount - 8; r++) { if (this.modules[r][6] != null) continue; this.modules[r][6] = (r % 2 == 0); }
            for (var c = 8; c < this.moduleCount - 8; c++) { if (this.modules[6][c] != null) continue; this.modules[6][c] = (c % 2 == 0); }
        },
        setupPositionAdjustPattern: function() {
            var pos = QRUtil.getAlignmentPattern(this.typeNumber);
            for (var i = 0; i < pos.length; i++) {
                for (var j = 0; j < pos.length; j++) {
                    var row = pos[i], col = pos[j];
                    if (this.modules[row][col] != null) continue;
                    for (var r = -2; r <= 2; r++) {
                        for (var c = -2; c <= 2; c++) {
                            if (r == -2 || r == 2 || c == -2 || c == 2 || (r == 0 && c == 0)) this.modules[row + r][col + c] = true;
                            else this.modules[row + r][col + c] = false;
                        }
                    }
                }
            }
        },
        setupTypeInfo: function(test, maskPattern) {
            var data = (this.errorCorrectLevel << 3) | maskPattern;
            var bits = QRUtil.getBCHTypeInfo(data);
            for (var i = 0; i < 15; i++) {
                var mod = (!test && ((bits >> i) & 1) == 1);
                if (i < 6) this.modules[i][8] = mod; else if (i < 8) this.modules[i + 1][8] = mod; else this.modules[this.moduleCount - 15 + i][8] = mod;
            }
            for (var i = 0; i < 15; i++) {
                var mod = (!test && ((bits >> i) & 1) == 1);
                if (i < 8) this.modules[8][this.moduleCount - i - 1] = mod; else if (i < 9) this.modules[8][15 - i - 1 + 1] = mod; else this.modules[8][15 - i - 1] = mod;
            }
            this.modules[this.moduleCount - 8][8] = (!test);
        },
        mapData: function(data, maskPattern) {
            var inc = -1, row = this.moduleCount - 1, bitIndex = 7, byteIndex = 0;
            for (var col = this.moduleCount - 1; col > 0; col -= 2) {
                if (col == 6) col--;
                while (true) {
                    for (var c = 0; c < 2; c++) {
                        if (this.modules[row][col - c] == null) {
                            var dark = false;
                            if (byteIndex < data.length) dark = (((data[byteIndex] >>> bitIndex) & 1) == 1);
                            if (QRUtil.getMask(maskPattern, row, col - c)) dark = !dark;
                            this.modules[row][col - c] = dark; bitIndex--;
                            if (bitIndex == -1) { byteIndex++; bitIndex = 7; }
                        }
                    }
                    row += inc;
                    if (row < 0 || this.moduleCount <= row) { row -= inc; inc = -inc; break; }
                }
            }
        }
    };
    QRCode.createData = function(typeNumber, errorCorrectLevel, dataList) {
        var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel), buffer = new QRBitBuffer();
        for (var i = 0; i < dataList.length; i++) {
            var data = dataList[i];
            buffer.put(data.mode, 4);
            buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber));
            data.write(buffer);
        }
        var totalDataCount = 0;
        for (var i = 0; i < rsBlocks.length; i++) totalDataCount += rsBlocks[i].dataCount;
        if (buffer.getLengthInBits() > totalDataCount * 8) throw new Error("Data too long");
        if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) buffer.put(0, 4);
        while (buffer.getLengthInBits() % 8 != 0) buffer.putBit(false);
        while (true) {
            if (buffer.getLengthInBits() >= totalDataCount * 8) break;
            buffer.put(0xec, 8);
            if (buffer.getLengthInBits() >= totalDataCount * 8) break;
            buffer.put(0x11, 8);
        }
        return QRCode.createBytes(buffer, rsBlocks);
    };
    QRCode.createBytes = function(buffer, rsBlocks) {
        var offset = 0, maxDcCount = 0, maxEcCount = 0;
        var dcdata = new Array(rsBlocks.length), ecdata = new Array(rsBlocks.length);
        for (var r = 0; r < rsBlocks.length; r++) {
            var dcCount = rsBlocks[r].dataCount, ecCount = rsBlocks[r].totalCount - dcCount;
            maxDcCount = Math.max(maxDcCount, dcCount); maxEcCount = Math.max(maxEcCount, ecCount);
            dcdata[r] = new Array(dcCount);
            for (var i = 0; i < dcdata[r].length; i++) dcdata[r][i] = 0xff & buffer.buffer[i + offset];
            offset += dcCount;
            var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount), rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);
            var modPoly = rawPoly.mod(rsPoly);
            ecdata[r] = new Array(rsPoly.getLength() - 1);
            for (var i = 0; i < ecdata[r].length; i++) {
                var modIndex = i + modPoly.getLength() - ecdata[r].length;
                ecdata[r][i] = (modIndex >= 0) ? modPoly.get(modIndex) : 0;
            }
        }
        var totalCodeCount = 0;
        for (var i = 0; i < rsBlocks.length; i++) totalCodeCount += rsBlocks[i].totalCount;
        var data = new Array(totalCodeCount), index = 0;
        for (var i = 0; i < maxDcCount; i++) { for (var r = 0; r < rsBlocks.length; r++) { if (i < dcdata[r].length) data[index++] = dcdata[r][i]; } }
        for (var i = 0; i < maxEcCount; i++) { for (var r = 0; r < rsBlocks.length; r++) { if (i < ecdata[r].length) data[index++] = ecdata[r][i]; } }
        return data;
    };
    var QRMode = { MODE_8BIT_BYTE: 4 }, QRErrorCorrectLevel = { L: 1, M: 0, Q: 3, H: 2 };
    var QRMaskPattern = { PATTERN000: 0 };
    var QRUtil = {
        getBCHTypeInfo: function(data) { var d = data << 10; while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(0x537) >= 0) d ^= (0x537 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(0x537))); return ((data << 10) | d) ^ 0x5412; },
        getBCHDigit: function(data) { var digit = 0; while (data != 0) { digit++; data >>>= 1; } return digit; },
        getAlignmentPattern: function(typeNumber) { var TABLE = [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38]]; return TABLE[typeNumber - 1] || []; },
        getMask: function(maskPattern, i, j) { return (i + j) % 2 == 0; },
        getErrorCorrectPolynomial: function(errorCorrectLength) { var a = new QRPolynomial([1], 0); for (var i = 0; i < errorCorrectLength; i++) a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0)); return a; },
        getLengthInBits: function(mode, type) { if (1 <= type && type < 10) return 8; return 8; }
    };
    function QRMath() {}
    var EXP_TABLE = new Array(256), LOG_TABLE = new Array(256);
    for (var i = 0; i < 8; i++) EXP_TABLE[i] = 1 << i;
    for (var i = 8; i < 256; i++) EXP_TABLE[i] = EXP_TABLE[i - 4] ^ EXP_TABLE[i - 5] ^ EXP_TABLE[i - 6] ^ EXP_TABLE[i - 8];
    for (var i = 0; i < 255; i++) LOG_TABLE[EXP_TABLE[i]] = i;
    QRMath.gexp = function(n) { while (n < 0) n += 255; while (n >= 255) n -= 255; return EXP_TABLE[n]; };
    QRMath.glog = function(n) { if (n < 1) throw new Error("glog(" + n + ")"); return LOG_TABLE[n]; };
    function QRPolynomial(num, shift) {
        var offset = 0; while (offset < num.length && num[offset] == 0) offset++;
        this.num = new Array(num.length - offset + shift);
        for (var i = 0; i < num.length - offset; i++) this.num[i] = num[i + offset];
    }
    QRPolynomial.prototype = {
        get: function(index) { return this.num[index]; }, getLength: function() { return this.num.length; },
        multiply: function(e) {
            var num = new Array(this.getLength() + e.getLength() - 1);
            for (var i = 0; i < this.getLength(); i++) { for (var j = 0; j < e.getLength(); j++) num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j))); }
            return new QRPolynomial(num, 0);
        },
        mod: function(e) {
            if (this.getLength() - e.getLength() < 0) return this;
            var ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0));
            var num = new Array(this.getLength()); for (var i = 0; i < this.getLength(); i++) num[i] = this.get(i);
            for (var i = 0; i < e.getLength(); i++) num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio);
            return new QRPolynomial(num, 0).mod(e);
        }
    };
    function QRRSBlock(totalCount, dataCount) { this.totalCount = totalCount; this.dataCount = dataCount; }
    QRRSBlock.RS_BLOCK_TABLE = [[], [26, 19]];
    QRRSBlock.getRSBlocks = function(typeNumber, errorCorrectLevel) {
        var list = [];
        // Simplified RS Block table for Level L/M/Q/H for small QR types
        const blocks = [
            [1, 26, 19], // Type 1, Level M
            [1, 44, 34], // Type 2, Level M
            [1, 70, 55], // Type 3, Level M
            [1, 100, 80]  // Type 4, Level M
        ];
        const b = blocks[typeNumber - 1] || blocks[0];
        for (var i = 0; i < b[0]; i++) list.push(new QRRSBlock(b[1], b[2]));
        return list;
    };
    function QRBitBuffer() { this.buffer = []; this.length = 0; }
    QRBitBuffer.prototype = {
        get: function(index) { return ((this.buffer[Math.floor(index / 8)] >>> (7 - index % 8)) & 1) == 1; },
        put: function(num, length) { for (var i = 0; i < length; i++) this.putBit(((num >>> (length - i - 1)) & 1) == 1); },
        getLengthInBits: function() { return this.length; },
        putBit: function(bit) {
            var bufIndex = Math.floor(this.length / 8);
            if (this.buffer.length <= bufIndex) this.buffer.push(0);
            if (bit) this.buffer[bufIndex] |= (0x80 >>> (this.length % 8));
            this.length++;
        }
    };
    function QR8bitByte(data) { this.mode = QRMode.MODE_8BIT_BYTE; this.data = data; }
    QR8bitByte.prototype = {
        getLength: function(buffer) { return this.data.length; },
        write: function(buffer) { for (var i = 0; i < this.data.length; i++) buffer.put(this.data.charCodeAt(i), 8); }
    };

    return {
        generateBase64: function(text) {
            try {
                const qr = new QRCode(4, QRErrorCorrectLevel.M);
                qr.addData(text);
                qr.make();
                
                const canvas = document.createElement('canvas');
                const cellSize = 10;
                const margin = cellSize * 2;
                const size = qr.getModuleCount() * cellSize + margin * 2;
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d');
                
                // Background
                ctx.fillStyle = '#0b0b0b';
                ctx.fillRect(0, 0, size, size);
                
                // QR Modules
                ctx.fillStyle = '#c9a050';
                for (var row = 0; row < qr.getModuleCount(); row++) {
                    for (var col = 0; col < qr.getModuleCount(); col++) {
                        if (qr.isDark(row, col)) {
                            ctx.fillRect(margin + col * cellSize, margin + row * cellSize, cellSize, cellSize);
                        }
                    }
                }
                return canvas.toDataURL('image/png');
            } catch (e) {
                console.error("Local QR Math failed:", e);
                return null;
            }
        }
    };
})();

export const generateLocalQRCode = async (data) => {
    // We now use the pure math local generator FIRST. 
    // This is 100% AdBlocker proof and zero-network.
    return QRGenerator.generateBase64(data);
};
