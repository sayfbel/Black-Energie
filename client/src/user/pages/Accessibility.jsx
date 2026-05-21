import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Accessibility = () => {
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
                    {t('legal.accessibility')}
                </motion.h1>

                <div style={{ lineHeight: '1.8', fontSize: '1.05rem', color: '#333' }}>
                    <p style={{ marginBottom: '2rem' }}>
                        <strong>Black Energie</strong> {language === 'ar' ? 'ملتزمة بضمان إمكانية الوصول الرقمي للأشخاص ذوي الإعاقة. نحن نحسن باستمرار تجربة المستخدم للجميع ونطبق معايير إمكانية الوصول ذات الصلة.' : language === 'fr' ? 's\'engage à assurer l\'accessibilité numérique aux personnes handicapées. Nous améliorons continuellement l\'expérience utilisateur pour tous et appliquons les normes d\'accessibilité pertinentes.' : 'is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.'}
                    </p>

                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', marginTop: '3rem', textTransform: 'uppercase', letterSpacing: '2px' }}>{t('legal.conformance')}</h2>
                    <p style={{ marginBottom: '1.5rem' }}>
                        {language === 'ar' ? 'تحدد إرشادات إمكانية وصول محتوى الويب (WCAG) متطلبات المصممين والمطورين لتحسين إمكانية الوصول للأشخاص ذوي الإعاقة.' : language === 'fr' ? 'Les règles pour l\'accessibilité des contenus Web (WCAG) définissent les exigences pour les concepteurs et les développeurs.' : 'The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities.'}
                    </p>

                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', marginTop: '3rem', textTransform: 'uppercase', letterSpacing: '2px' }}>{t('legal.feedback')}</h2>
                    <p style={{ marginBottom: '1.5rem' }}>
                        {language === 'ar' ? 'نرحب بملاحظاتكم حول إمكانية الوصول إلى بلاك إنيرجي. يرجى إعلامنا إذا واجهت عوائق:' : language === 'fr' ? 'Nous apprécions vos commentaires sur l\'accessibilité de Black Energie. Veuillez nous informer si vous rencontrez des obstacles :' : 'We welcome your feedback on the accessibility of Black Energie. Please let us know if you encounter accessibility barriers:'}
                    </p>
                    <ul style={{ marginBottom: '2rem', paddingLeft: '1.5rem', paddingRight: language === 'ar' ? '1.5rem' : 0 }}>
                        <li>{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}: accessibility@blackenergie.com</li>
                        <li>{language === 'ar' ? 'العنوان: 123 شارع محمصة الحرفيين، منطقة القهوة' : 'Address: 123 Artisan Roastery Blvd, Coffee District'}</li>
                    </ul>

                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', marginTop: '3rem', textTransform: 'uppercase', letterSpacing: '2px' }}>{t('legal.compatibility')}</h2>
                    <p style={{ marginBottom: '1.5rem' }}>
                        {language === 'ar' ? 'تم تصميم بلاك إنيرجي لتكون متوافقة مع التقنيات المساعدة التالية:' : language === 'fr' ? 'Black Energie est conçu pour être compatible avec les technologies d\'assistance suivantes :' : 'Black Energie is designed to be compatible with the following assistive technologies:'}
                    </p>
                    <ul style={{ marginBottom: '2rem', paddingLeft: '1.5rem', paddingRight: language === 'ar' ? '1.5rem' : 0 }}>
                        <li>{language === 'ar' ? 'متصفحات الويب الحديثة (كروم، سفاري، فايرفوكس)' : 'Modern web browsers (Chrome, Safari, Firefox, Edge)'}</li>
                        <li>{language === 'ar' ? 'قارئات الشاشة على كل من منصات سطح المكتب والهواتف المحمولة' : 'Screen readers on both desktop and mobile platforms'}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Accessibility;
