import { Portal } from "@/components/Portal";
import { getDictionary } from "./dictionaries";

export default async function Page({ params }: { params: any }) {
  const lang = (await params).lang;
  const t: any = await getDictionary(lang); // en

  console.log("t", t);

  // if t is null, return 404
  if (!t) {
    return <></>;
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 flex flex-col gap-4">
      <h1 className="text-3xl font-bold">
        {t.portal.title}
      </h1>
      <Portal content={t.portal} lang={lang}/>
    </div>
  );
}
