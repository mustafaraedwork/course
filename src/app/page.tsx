import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">
                أكاديمية التسويق الرقمي
              </h1>
            </div>
            <div className="flex space-x-4">
              <Link 
                href="/auth" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                تسجيل الدخول
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-blue-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              تعلم التسويق الرقمي
              <span className="text-blue-600 block">من الصفر للاحتراف</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              كورس شامل لتعليم Facebook و Instagram Ads بطريقة عملية ومبسطة. 
              ابدأ رحلتك في عالم التسويق الرقمي اليوم!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/auth" 
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                ابدأ التعلم الآن
              </Link>
              <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors">
                شاهد الفيديو التعريفي
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Problem */}
            <div className="text-center">
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">😫</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">المشكلة</h3>
              <ul className="text-gray-600 space-y-3 text-right">
                <li>• صعوبة في فهم إعلانات فيسبوك وإنستجرام</li>
                <li>• إهدار الأموال على إعلانات غير فعالة</li>
                <li>• عدم معرفة كيفية استهداف العملاء المناسبين</li>
                <li>• نقص في المحتوى العربي عالي الجودة</li>
              </ul>
            </div>

            {/* Solution */}
            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">الحل</h3>
              <ul className="text-gray-600 space-y-3 text-right">
                <li>• شرح مبسط وعملي لجميع أساسيات التسويق</li>
                <li>• استراتيجيات مثبتة لتحقيق أفضل النتائج</li>
                <li>• دروس تطبيقية خطوة بخطوة</li>
                <li>• محتوى عربي احترافي ومحدث</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              محتويات الكورس
            </h3>
            <p className="text-xl text-gray-600">
              4 فصول شاملة تغطي كل ما تحتاجه في التسويق الرقمي
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Chapter 1 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                مقدمة في التسويق الرقمي
              </h4>
              <p className="text-gray-600 text-sm mb-3">
                أساسيات التسويق الرقمي ووضع الاستراتيجيات
              </p>
              <span className="text-blue-600 text-sm font-medium">3 دروس</span>
            </div>

            {/* Chapter 2 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Facebook و Instagram Ads
              </h4>
              <p className="text-gray-600 text-sm mb-3">
                إنشاء وإدارة الحملات الإعلانية بفعالية
              </p>
              <span className="text-blue-600 text-sm font-medium">5 دروس</span>
            </div>

            {/* Chapter 3 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                تحسين الحملات
              </h4>
              <p className="text-gray-600 text-sm mb-3">
                قراءة الإحصائيات وتحسين الأداء
              </p>
              <span className="text-blue-600 text-sm font-medium">4 دروس</span>
            </div>

            {/* Chapter 4 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold">4</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                الاستراتيجيات المتقدمة
              </h4>
              <p className="text-gray-600 text-sm mb-3">
                تقنيات متقدمة لزيادة العائد على الاستثمار
              </p>
              <span className="text-blue-600 text-sm font-medium">6 دروس</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-white mb-4">
            جاهز لتبدأ رحلتك في التسويق الرقمي؟
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            انضم لآلاف الطلاب الذين حققوا نجاحاً باهراً في مجال التسويق الرقمي
          </p>
          <Link 
            href="/auth" 
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            ابدأ الآن مجاناً
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h4 className="text-2xl font-bold mb-4">أكاديمية التسويق الرقمي</h4>
            <p className="text-gray-400 mb-6">
              منصة تعليمية متخصصة في تعليم التسويق الرقمي باللغة العربية
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">سياسة الخصوصية</a>
              <a href="#" className="text-gray-400 hover:text-white">شروط الاستخدام</a>
              <a href="#" className="text-gray-400 hover:text-white">تواصل معنا</a>
            </div>
            <p className="text-gray-500 mt-6">
              © 2024 أكاديمية التسويق الرقمي. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}