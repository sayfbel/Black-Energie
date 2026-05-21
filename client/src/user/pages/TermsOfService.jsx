import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const TermsOfService = () => {
    const { t, language } = useLanguage();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: '#fff', paddingBottom: '8rem', color: '#000', fontFamily: 'Outfit, sans-serif', direction: language === 'ar' ? 'rtl' : 'ltr' }}>
            <div style={{ height: '100px', background: '#000' }}></div>
            
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '6rem 2rem' }}>
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="luxury-font" 
                    style={{ fontSize: '3.5rem', marginBottom: '4rem', textAlign: 'center' }}
                >
                    {t('legal.termsOfService')}
                </motion.h1>

                <div style={{ lineHeight: '1.8', fontSize: '1.05rem', color: '#333' }}>
                    <p style={{ marginBottom: '2rem', fontStyle: 'italic' }}>
                        {language === 'ar' ? 'آخر تحديث: 14 مايو 2026' : language === 'fr' ? 'Dernière mise à jour : 14 mai 2026' : 'Last Updated: May 14, 2026'}
                    </p>

                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', marginTop: '3rem', textTransform: 'uppercase', letterSpacing: '2px' }}>1. {language === 'ar' ? 'الموافقة على الشروط' : language === 'fr' ? 'Acceptation des conditions' : 'Agreement to Terms'}</h2>
                    <p style={{ marginBottom: '1.5rem' }}>
                        {language === 'ar' ? 'من خلال الوصول إلى موقع بلاك إنيرجي أو استخدامه، فإنك توافق على الالتزام بشروط الخدمة هذه وجميع القوانين واللوائح المعمول بها.' : language === 'fr' ? 'En accédant au site web de Black Energie ou en l\'utilisant, vous acceptez d\'être lié par les présentes conditions de service.' : 'By accessing or using the Black Energie website, you agree to be bound by these Terms of Service and all applicable laws and regulations.'}
                    </p>

                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', marginTop: '3rem', textTransform: 'uppercase', letterSpacing: '2px' }}>2. {language === 'ar' ? 'ترخيص الاستخدام' : language === 'fr' ? 'Licence d\'utilisation' : 'Use License'}</h2>
                    <p style={{ marginBottom: '1.5rem' }}>
                        {language === 'ar' ? 'يُمنح الإذن بتنزيل نسخة واحدة مؤقتًا من المواد الموجودة على موقع بلاك إنيرجي للمشاهدة الشخصية وغير التجارية فقط.' : language === 'fr' ? 'La permission est accordée de télécharger temporairement une copie du matériel sur le site de Black Energie.' : 'Permission is granted to temporarily download one copy of the materials on Black Energie\'s website for personal, non-commercial transitory viewing only.'}
                    </p>

                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', marginTop: '3rem', textTransform: 'uppercase', letterSpacing: '2px' }}>3. {language === 'ar' ? 'مبيعات المنتجات' : language === 'fr' ? 'Vente de produits' : 'Product Sales'}</h2>
                    <p style={{ marginBottom: '1.5rem' }}>
                        {language === 'ar' ? 'تخضع جميع منتجات القهوة والملحقات المباعة على هذا الموقع للتوافر.' : language === 'fr' ? 'Tous les produits de café et accessoires vendus sur ce site sont sous réserve de disponibilité.' : 'All coffee products, roasts, and accessories sold on this site are subject to availability.'}
                    </p>

                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', marginTop: '3rem', textTransform: 'uppercase', letterSpacing: '2px' }}>4. {language === 'ar' ? 'الشحن والتوصيل' : language === 'fr' ? 'Expédition et livraison' : 'Shipping & Delivery'}</h2>
                    <p style={{ marginBottom: '1.5rem' }}>
                        {language === 'ar' ? 'توفر بلاك إنيرجي شحناً عالمياً سريعاً.' : language === 'fr' ? 'Black Energie assure une expédition mondiale rapide.' : 'Black Energie provides expedited global shipping.'}
                    </p>

                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', marginTop: '3rem', textTransform: 'uppercase', letterSpacing: '2px' }}>5. {language === 'ar' ? 'المرتجعات والمبالغ المستردة' : language === 'fr' ? 'Retours et remboursements' : 'Returns & Refunds'}</h2>
                    <p style={{ marginBottom: '1.5rem' }}>
                        {language === 'ar' ? 'نظراً للطبيعة القابلة للتلف للقهوة الحرفية، فإننا لا نقبل عموماً المرتجعات.' : language === 'fr' ? 'En raison de la nature périssable du café artisanal, nous n\'acceptons généralement pas de retours.' : 'Due to the perishable nature of artisanal coffee, we generally do not accept returns on coffee beans.'}
                    </p>

                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', marginTop: '3rem', textTransform: 'uppercase', letterSpacing: '2px' }}>6. {language === 'ar' ? 'القانون المعمول به' : language === 'fr' ? 'Droit applicable' : 'Governing Law'}</h2>
                    <p style={{ marginBottom: '1.5rem' }}>
                        {language === 'ar' ? 'تخضع هذه الشروط والأحكام وتفسر وفقاً للقوانين المعمول بها.' : language === 'fr' ? 'Ces conditions générales sont régies et interprétées conformément aux lois en vigueur.' : 'These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Black Energie operates.'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
