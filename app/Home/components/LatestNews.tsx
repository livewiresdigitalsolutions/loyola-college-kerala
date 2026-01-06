import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

export default function LatestNews() {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* TITLE */}
        <h2 className="text-center text-4xl font-semibold text-primary mb-12">
          Latest News & Updates
        </h2>

        {/* MAIN CARD */}
        <div className="bg-white  rounded-2xl p-6 shadow-xl mb-10 transition-transform duration-300 hover:scale-105">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

            {/* IMAGE */}
            <div className="rounded-xl overflow-hidden">
              <Image
                src="/assets/news.jpg"
                alt="Workshop"
                width={600}
                height={400}
                className="w-full h-[280px] object-cover"
              />
            </div>

            {/* CONTENT */}
            <div className="space-y-4">
              <span className="inline-block px-4 py-1 text-sm rounded-full bg-[#ECEBFA] text-primary font-medium">
                WORKSHOP
              </span>

              <h3 className="text-2xl font-semibold text-primary leading-snug">
                Three-Day Intensive Skill Training on Dialectical Behavioural Therapy
              </h3>

              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Calendar className="w-4 h-4" />
                Jan 15, 2025
              </div>

              <p className="text-gray-600">
                Loyola recently held an intensive workshop on Dialectical Behavioural
                Therapy for mental health professionals.
              </p>

              <Link
                href="#"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                Read More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* BOTTOM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* CARD 1 */}
          <NewsCard
            date="Jan 17, 2025"
            title="Loyola Faculty Published in Top Journal"
            image="/assets/news.jpg"
            description="A Loyola faculty member has been published in one of the leading academic journals."
          />

          {/* CARD 2 */}
          <NewsCard
            date="Jan 12, 2025"
            title="Guest Lecture on Social Policy and Governance"
            image="/assets/news.jpg"
            description="An expert guest lecture on social policy and governance held in the main auditorium."
          />

          {/* CARD 3 */}
          <NewsCard
            date="Jan 08, 2025"
            title="Loyola Students Win National Research Award"
            image="/assets/news.jpg"
            description="A team of Loyola students has won a prestigious national award for their research."
          />

        </div>

        {/* VIEW ALL */}
        <div className="mt-10 text-center">
          <Link
            href="#"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            View All News <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}

/* ---------------- SMALL CARD COMPONENT ---------------- */

function NewsCard({
  date,
  title,
  image,
  description,
}: {
  date: string;
  title: string;
  image: string;
  description: string;
}) {
  return (
    <div className=" rounded-2xl p-4 shadow-xl bg-white space-y-4 transition-transform duration-300 hover:scale-105 ">
      <div className="text-sm text-gray-500">{date}</div>

      <h4 className="text-lg font-semibold text-primary">
        {title}
      </h4>

      <div className="rounded-xl overflow-hidden">
        <Image
          src={image}
          alt={title}
          width={400}
          height={250}
          className="w-full h-[160px] object-cover"
        />
      </div>

      <p className="text-gray-600 text-sm">
        {description}
      </p>

      <Link
        href="#"
        className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
      >
        Read More <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
