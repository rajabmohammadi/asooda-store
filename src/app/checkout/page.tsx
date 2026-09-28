"use client";

import { Banknote, Info, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useCart } from "@/components/CartProvider";
import { getProduct } from "@/data/catalog";
import { advanceThreshold, cities } from "@/lib/config";
import { cn, formatAfn, normalizeAfPhone, toFaDigits } from "@/lib/format";

const noteChips = ["قبل از رسیدن زنگ بزنید", "به خانم تحویل شود"];

type Errors = Partial<Record<"name" | "phone" | "city" | "address" | "form", string>>;

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, ready, subtotal, clear } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", altPhone: "", city: "kabul", address: "", note: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const city = cities.find((c) => c.id === form.city)!;
  const total = subtotal + city.fee;
  const needsAdvance = form.city !== "kabul" && total > advanceThreshold;

  if (!ready) return <div className="p-8" />;
  if (!lines.length) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="mb-4">سبد خرید شما خالی است.</p>
        <Link href="/" className="font-bold text-brand">
          برگشت به خانه
        </Link>
      </div>
    );
  }

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const e: Errors = {};
    if (form.name.trim().length < 2) e.name = "لطفاً نام خود را بنویسید";
    if (!normalizeAfPhone(form.phone)) e.phone = "شماره مبایل درست نیست. مثال: ۰۷۹۱۲۳۴۵۶۷";
    if (form.address.trim().length < 5) e.address = "لطفاً ناحیه و یک نشانی نزدیک را بنویسید";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, altPhone: form.altPhone || undefined, note: form.note || undefined, lines }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({
          form:
            res.status === 409
              ? "یکی از اجناس سبد شما ختم شده یا رنگ آن انتخاب نشده. لطفاً سبد را دوباره ببینید."
              : "ثبت سفارش ناکام شد. لطفاً معلومات را بررسی کنید یا در واتساپ سفارش بدهید.",
        });
        return;
      }
      clear();
      router.push(`/order/${data.id}`);
    } catch {
      setErrors({ form: "اتصال انترنت قطع است. لطفاً دوباره کوشش کنید یا در واتساپ سفارش بدهید." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="px-4 pt-4 md:grid md:grid-cols-[1fr_340px] md:items-start md:gap-6">
      <div className="space-y-4">
        <h1 className="text-xl font-extrabold">ثبت سفارش</h1>
        <p className="text-sm text-muted">حساب کاربری لازم نیست. همکار ما برای تایید سفارش به شما زنگ می زند.</p>

        <Field label="نام" error={errors.name} htmlFor="name">
          <input id="name" autoComplete="name" value={form.name} onChange={set("name")} className={inputCls(errors.name)} />
        </Field>

        <Field label="شماره مبایل (واتساپ)" error={errors.phone} htmlFor="phone">
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            placeholder="07X XXX XXXX"
            value={form.phone}
            onChange={set("phone")}
            className={cn(inputCls(errors.phone), "text-end")}
          />
        </Field>

        <Field label="ولایت / شهر" htmlFor="city">
          <select id="city" value={form.city} onChange={set("city")} className={inputCls()}>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="ناحیه و آدرس با نشانی نزدیک" error={errors.address} htmlFor="address">
          <textarea
            id="address"
            rows={3}
            placeholder="مثلاً کارته چهار، نزدیک مسجد …"
            value={form.address}
            onChange={set("address")}
            className={cn(inputCls(errors.address), "h-auto py-2.5")}
          />
        </Field>

        <details className="rounded-2xl border border-line bg-surface px-4">
          <summary className="cursor-pointer py-3 text-sm font-medium">معلومات اضافی (اختیاری)</summary>
          <div className="space-y-4 pb-4">
            <Field label="شماره دیگر" htmlFor="altPhone">
              <input id="altPhone" type="tel" inputMode="tel" dir="ltr" value={form.altPhone} onChange={set("altPhone")} className={cn(inputCls(), "text-end")} />
            </Field>
            <Field label="یادداشت برای تحویل" htmlFor="note">
              <textarea id="note" rows={2} value={form.note} onChange={set("note")} className={cn(inputCls(), "h-auto py-2.5")} />
              <div className="mt-2 flex flex-wrap gap-2">
                {noteChips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, note: f.note.includes(chip) ? f.note : [f.note, chip].filter(Boolean).join("، ") }))}
                    className="rounded-full border border-line px-3 py-1 text-[12px]"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </details>

        <fieldset className="rounded-2xl border-2 border-ok bg-ok-soft p-4">
          <legend className="sr-only">طریقه پرداخت</legend>
          <label className="flex items-center gap-3">
            <input type="radio" name="payment" checked readOnly className="size-5 accent-ok" />
            <Banknote className="size-6 text-ok" />
            <span>
              <b className="block">پرداخت نقد در وقت تحویل</b>
              <span className="text-[12px] text-muted">اول جنس را ببینید، بعد پول بپردازید</span>
            </span>
          </label>
        </fieldset>
      </div>

      <aside className="mt-5 space-y-3 rounded-2xl border border-line bg-surface p-4 md:sticky md:top-32 md:mt-11">
        <h2 className="font-bold">خلاصه سفارش</h2>
        <ul className="space-y-1.5 text-[13px]">
          {lines.map((l) => {
            const p = getProduct(l.slug)!;
            return (
              <li key={`${l.slug}-${l.shade ?? ""}`} className="flex justify-between gap-3">
                <span className="line-clamp-1">
                  {p.name}
                  {l.shade && ` (${l.shade})`} × {toFaDigits(l.qty)}
                </span>
                <span className="shrink-0">{formatAfn(p.price * l.qty)}</span>
              </li>
            );
          })}
        </ul>
        <dl className="space-y-1.5 border-t border-line pt-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">جمع اجناس</dt>
            <dd>{formatAfn(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">کرایه انتقال ({city.name})</dt>
            <dd>{formatAfn(city.fee)}</dd>
          </div>
          <div className="flex justify-between text-base font-extrabold">
            <dt>مجموع</dt>
            <dd>{formatAfn(total)}</dd>
          </div>
        </dl>
        <p className="text-[12px] text-muted">وقت تحویل: {city.eta}</p>

        {needsAdvance && (
          <p className="flex gap-2 rounded-xl bg-gold-soft p-3 text-[12px] leading-6">
            <Info className="size-4.5 shrink-0 text-gold" />
            برای سفارش های بزرگ به ولایات، همکار ما شاید یک پیش پرداخت کم از طریق حساب پی، ام پیسه یا حواله بخواهد.
          </p>
        )}

        {errors.form && <p className="rounded-xl bg-red-50 p-3 text-[13px] text-danger" role="alert">{errors.form}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-brand text-lg font-bold text-white hover:bg-brand-dark disabled:opacity-70"
        >
          {submitting && <Loader2 className="size-5 animate-spin" />}
          سفارش را ثبت کنید
        </button>
      </aside>
    </form>
  );
}

const inputCls = (error?: string) =>
  cn(
    "h-12 w-full rounded-xl border bg-surface px-4 text-[15px] outline-none transition focus:border-brand",
    error ? "border-danger" : "border-line",
  );

function Field({ label, error, htmlFor, children }: { label: string; error?: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-bold">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-[12px] text-danger">{error}</p>}
    </div>
  );
}
