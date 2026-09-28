import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { WhatsAppIcon } from "@/components/icons";
import { Breadcrumb } from "@/components/sections";
import { cities, store } from "@/lib/config";
import { formatAfn, whatsappLink } from "@/lib/format";

// Policy copy: have a native Kabuli copy-editor review before launch.
type Page = { title: string; body: React.ReactNode };

const pages: Record<string, Page> = {
  "how-to-order": {
    title: "رهنمای خرید",
    body: (
      <>
        <ol className="list-decimal space-y-3 ps-5">
          <li>جنس مورد نظر را پیدا کنید و «به سبد اضافه کنید» را بزنید. اگر جنس رنگ دارد، اول رنگ را انتخاب کنید.</li>
          <li>به سبد خرید بروید و «ثبت سفارش» را بزنید.</li>
          <li>نام، شماره مبایل، ولایت و آدرس با یک نشانی نزدیک را بنویسید. حساب کاربری لازم نیست.</li>
          <li>همکار ما برای تایید سفارش، رنگ، آدرس و وقت تحویل به شما زنگ می زند.</li>
          <li>وقتی جنس رسید، اول بسته را ببینید و بعد پول را نقد بپردازید.</li>
        </ol>
        <p>
          اگر آسان تر است، می توانید از دکمه سبز «سفارش از طریق واتساپ» استفاده کنید. معلومات جنس خودکار در پیام نوشته می شود.
        </p>
      </>
    ),
  },
  authenticity: {
    title: "اصل بودن اجناس",
    body: (
      <>
        <p>ما می دانیم که در بازار اجناس تقلبی و تاریخ تیر زیاد است. برای همین:</p>
        <ul className="list-disc space-y-2 ps-5">
          <li>اجناس را فقط از نماینده های رسمی و وارد کننده های معتبر می خریم و بل خرید آن را نگه می داریم.</li>
          <li>تاریخ ختم، کشور ساخت و وارد کننده روی صفحه هر جنس نوشته شده است.</li>
          <li>عکس ها از اجناس واقعی گدام ما گرفته شده است، نه از انترنت.</li>
          <li>وقت تحویل، بسته مهر و موم را پیش از پرداخت ببینید.</li>
          <li>اگر جنس تقلبی بود، بدون هیچ مصرف تبدیل یا پول شما واپس داده می شود.</li>
        </ul>
      </>
    ),
  },
  returns: {
    title: "شرایط واپسی و تبدیلی",
    body: (
      <ul className="list-disc space-y-2 ps-5">
        <li>جنس خراب، اشتباه یا تقلبی تا ۷ روز بدون مصرف تبدیل می شود.</li>
        <li>بهتر است وقت تحویل، پیش روی انتقال دهنده بسته را ببینید تا اگر مشکلی بود همان جا تبدیل شود.</li>
        <li>به دلیل صحت و حفظ الصحه، جنس باز شده یا استفاده شده (به جز جنس خراب) واپس گرفته نمی شود.</li>
        <li>جنس باز نشده با بسته سالم تا ۳ روز قابل تبدیل است. کرایه انتقال به عهده مشتری است.</li>
        <li>پول به صورت نقد یا از طریق حساب پی / ام پیسه واپس داده می شود.</li>
      </ul>
    ),
  },
  delivery: {
    title: "قیمت و وقت انتقال",
    body: (
      <>
        <table className="w-full overflow-hidden rounded-xl text-sm ring-1 ring-line">
          <thead className="bg-brand-soft text-brand">
            <tr>
              <th className="p-3 text-start">ولایت</th>
              <th className="p-3 text-start">کرایه</th>
              <th className="p-3 text-start">وقت تحویل</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-surface">
            {cities.map((c) => (
              <tr key={c.id}>
                <td className="p-3">{c.name}</td>
                <td className="p-3">{formatAfn(c.fee)}</td>
                <td className="p-3">{c.eta}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>انتقال دهنده پیش از رسیدن به شما زنگ می زند. اگر می خواهید جنس به یک خانم تحویل شود، در یادداشت سفارش بنویسید.</p>
      </>
    ),
  },
  faq: {
    title: "پرسش های معمول",
    body: (
      <dl className="space-y-4">
        {[
          ["آیا باید حساب کاربری بسازم؟", "نه. فقط نام، شماره و آدرس کافی است."],
          ["پول را چطور بپردازم؟", "نقد در وقت تحویل. اول جنس را ببینید، بعد بپردازید."],
          ["از کجا بدانم جنس اصل است؟", "تاریخ ختم، کشور ساخت و وارد کننده روی هر جنس نوشته شده. صفحه «اصل بودن اجناس» را ببینید."],
          ["چقدر وقت می گیرد؟", "در کابل امروز یا فردا. در ولایات ۲ تا ۵ روز."],
          ["اگر رنگ را اشتباه انتخاب کردم چه؟", "وقتی همکار ما برای تایید زنگ زد، بگویید تا تبدیل کند."],
        ].map(([q, a]) => (
          <div key={q} className="rounded-xl bg-surface p-4 ring-1 ring-line">
            <dt className="font-bold">{q}</dt>
            <dd className="mt-1 text-muted">{a}</dd>
          </div>
        ))}
      </dl>
    ),
  },
  about: {
    title: "درباره ما",
    body: (
      <>
        {/* TODO: real story, shop photo, business licence number, years in operation */}
        <p>
          {store.name} یک فروشگاه کوچک و خانوادگی در کابل است که اجناس اصل آرایشی و مراقبت پوست را با تاریخ ختم معلوم به دست شما می رساند.
        </p>
        <p>آدرس دکان: {store.address}</p>
        <p className="text-muted">نمبر جواز کار: (به زودی)</p>
      </>
    ),
  },
  contact: {
    title: "تماس با ما",
    body: (
      <>
        <a
          href={whatsappLink(store.whatsapp, "سلام")}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 rounded-xl bg-wa px-5 py-3 font-bold text-white"
        >
          <WhatsAppIcon className="size-5" /> پیام در واتساپ
        </a>
        <p>
          تلفون: <a href={`tel:${store.phone.replace(/\s/g, "")}`} className="ltr font-medium">{store.phone}</a>
        </p>
        <p>وقت کاری: {store.hours}</p>
        <p>آدرس: {store.address}</p>
      </>
    ),
  },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: pages[(await params).slug]?.title ?? "یافت نشد" };
}

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export default async function InfoPage({ params }: Props) {
  const page = pages[(await params).slug];
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: page.title }]} />
      <article className="space-y-4 px-4 leading-8">
        <h1 className="text-2xl font-extrabold">{page.title}</h1>
        {page.body}
        <p className="pt-4 text-sm text-muted">
          سوال دیگری دارید؟{" "}
          <Link href="/info/contact" className="font-medium text-brand">
            با ما تماس بگیرید
          </Link>
        </p>
      </article>
    </div>
  );
}
