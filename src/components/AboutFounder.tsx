import Image from "next/image";

export default function AboutFounder() {
  return (
    <section id="about" className="relative w-full py-24 md:py-32 px-4 md:px-8 bg-black/50 overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] -translate-y-1/2 -z-10 pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Text Content */}
        <div className="flex flex-col">
          <h3 className="text-sm tracking-[0.3em] text-primary mb-4 font-light">داستان نوبنـا</h3>
          <h2 className="text-3xl md:text-5xl font-light text-white mb-8 leading-tight">
            ارتقای مدیریت پیمان سنتی به مدلی <span className="font-medium text-white/90">حرفه‌ای و شفاف</span>
          </h2>
          
          <div className="space-y-6 text-white/70 font-light text-base md:text-lg leading-relaxed text-justify md:text-right">
            <p>
              نوبنا برندی فعال در حوزه مدیریت پیمان، طراحی و اجرا، بازسازی و دکوراسیون داخلی است که با رویکردی شفاف، سیستم‌محور و حرفه‌ای، پروژه‌های مسکونی، اداری و تجاری را از ایده تا تحویل نهایی هدایت می‌کند.
            </p>
            <p>
              <strong className="text-white font-medium">پدرام رجبی‌مهر</strong>، بنیان‌گذار نوبنا، با بیش از دو دهه تجربه در صنعت ساختمان، نوبنا را با این هدف پایه‌گذاری کرده است. در تمام این سال‌ها، یکی از مهم‌ترین دغدغه‌های او، گردآوری تیمی حرفه‌ای، متعهد و قابل اعتماد بوده است؛ تیمی که بتواند کیفیت اجرا را در کنار نظم، مسئولیت‌پذیری و شفافیت حفظ کند.
            </p>
            <p>
              نگاه ما به پروژه بر این اساس شکل گرفته که کارفرما نباید درگیر پیچیدگی‌ها و فرسایش‌های روزمره اجرا شود، بلکه باید بتواند با اطمینان بیشتری تصمیم بگیرد و مسیر پروژه را با آرامش دنبال کند.
            </p>
          </div>
          
          <button className="mt-12 self-start px-8 py-3 border border-primary/50 text-white rounded-lg hover:bg-primary hover:text-black transition-all duration-300 tracking-wide text-sm bg-primary/5 backdrop-blur-sm">
            دانلود کاتالوگ و رزومه
          </button>
        </div>

        {/* Image / Abstract Visual */}
        <div className="relative h-[500px] lg:h-[700px] w-full rounded-3xl overflow-hidden border border-white/10 group">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-60" />
          <Image
            src="/images/hero.png" // Placeholder image, ideally a portrait of the founder or a very abstract architectural detail
            alt="پدرام رجبی‌مهر - بنیان‌گذار نوبنا"
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105 filter grayscale hover:grayscale-0"
          />
          <div className="absolute bottom-8 right-8 z-20">
            <p className="text-2xl font-light text-white mb-1 drop-shadow-md">پدرام رجبی‌مهر</p>
            <p className="text-primary text-sm tracking-wider font-light drop-shadow-md">بنیان‌گذار و مدیرعامل نوبنا</p>
          </div>
        </div>

      </div>
    </section>
  );
}
