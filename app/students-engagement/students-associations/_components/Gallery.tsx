import { AssociationData } from "../_data/associations";

interface GalleryProps {
  data: AssociationData;
}

const gradients = [
  "from-emerald-600 to-teal-700",
  "from-blue-600 to-indigo-700",
  "from-amber-500 to-orange-600",
  "from-purple-600 to-violet-700",
  "from-rose-500 to-pink-600",
  "from-cyan-600 to-teal-700",
  "from-green-600 to-emerald-700",
  "from-indigo-500 to-blue-700",
];

export default function Gallery({ data }: GalleryProps) {
  const galleryItems = data.activities.map((a, i) => ({
    title: a.title,
    gradient: gradients[i % gradients.length],
  }));

  return (
    <section
      id="gallery"
      className="scroll-mt-32 py-16 px-4 sm:px-6 lg:px-8 bg-gray-50"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Label */}
        <div className="flex items-center gap-3 mb-3">
          <span className="w-10 h-[3px] bg-[#F0B129] rounded-full" />
          <span className="text-sm font-bold tracking-widest text-[var(--primary)] uppercase">
            Gallery
          </span>
        </div>
        <p className="text-gray-500 text-sm mb-10 ml-[52px]">
          Moments captured from {data.name} events and activities.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
              className={`relative rounded-xl overflow-hidden aspect-[4/3] bg-gradient-to-br ${item.gradient} group cursor-pointer`}
            >
              {/* Decorative overlay */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.3),transparent_60%)]" />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end p-4">
                <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  {item.title}
                </p>
              </div>

              {/* Center icon placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-white/20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
