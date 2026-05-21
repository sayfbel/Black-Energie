import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const PrivacyPolicy = () => {
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
                    {t('legal.privacyPolicy')}
                </motion.h1>

                <div style={{ lineHeight: '1.8', fontSize: '1.05rem', color: '#333' }}>
                    <p style={{ marginBottom: '2rem' }}>
                        {language === 'ar' ? 'في بلاك إنيرجي، نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. ستعلمك سياسة الخصوصية هذه بكيفية العناية ببياناتك الشخصية عند زيارة موقعنا.' : language === 'fr' ? 'Chez Black Energie, nous respectons votre vie privée et nous nous engageons à protéger vos données personnelles.' : 'At Black Energie, we respect your privacy and are committed to protecting your personal data.'}
                    </p>

                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', marginTop: '3rem', textTransform: 'uppercase', letterSpacing: '2px' }}>1. {language === 'ar' ? 'المعلومات التي نجمعها' : language === 'fr' ? 'Informations que nous collectons' : 'Information We Collect'}</h2>
                    <p style={{ marginBottom: '1.5rem' }}>
                        {language === 'ar' ? 'قد نقوم بجمع واستخدام وتخزين ونقل أنواع مختلفة من البيانات الشخصية عنك.' : language === 'fr' ? 'Nous pouvons collecter, utiliser, stocker et transférer différents types de données personnelles vous concernant.' : 'We may collect, use, store and transfer different kinds of personal data about you.'}
                    </p>

                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', marginTop: '3rem', textTransform: 'uppercase', letterSpacing: '2px' }}>2. {language === 'ar' ? 'كيفية استخدام معلوماتك' : language === 'fr' ? 'Comment nous utilisons vos informations' : 'How We Use Your Information'}</h2>
                    <p style={{ marginBottom: '1.5rem' }}>
                        {language === 'ar' ? 'سنستخدم بياناتك الشخصية فقط عندما يسمح لنا القانون بذلك.' : language === 'fr' ? 'Nous n\'utiliserons vos données personnelles que lorsque la loi nous le permettra.' : 'We will only use your personal data when the law allows us to.'}
                    </p>

                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', marginTop: '3rem', textTransform: 'uppercase', letterSpacing: '2px' }}>3. {language === 'ar' ? 'أمن البيانات' : language === 'fr' ? 'Sécurité des données' : 'Data Security'}</h2>
                    <p style={{ marginBottom: '1.5rem' }}>
                        {language === 'ar' ? 'لقد وضعنا تدابير أمنية مناسبة لمنع فقدان بياناتك الشخصية عن طريق الخطأ أو استخدامها أو الوصول إليها بطريقة غير مصرح بها.' : language === 'fr' ? 'Nous avons mis en place des mesures de sécurité appropriées pour empêcher que vos données personnelles ne soient accidentellement perdues.' : 'We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way.'}
                    </p>

                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', marginTop: '3rem', textTransform: 'uppercase', letterSpacing: '2px' }}>4. {language === 'ar' ? 'حقوقك القانونية' : language === 'fr' ? 'Vos droits légaux' : 'Your Legal Rights'}</h2>
                    <p style={{ marginBottom: '1.5rem' }}>
                        {language === 'ar' ? 'في ظل ظروف معينة، لديك حقوق بموجب قوانين حماية البيانات فيما يتعلق ببياناتك الشخصية.' : language === 'fr' ? 'Dans certaines circonstances, vous avez des droits en vertu des lois sur la protection des données.' : 'Under certain circumstances, you have rights under data protection laws in relation to your personal data.'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
