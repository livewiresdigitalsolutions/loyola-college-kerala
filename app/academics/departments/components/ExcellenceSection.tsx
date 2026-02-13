import React from 'react'
import Image from 'next/image'

export default function ExcellenceSection() {
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start">
                    {/* LEFT - TITLE */}
                    <div className="lg:col-span-1">
                        <div className="w-12 h-1 bg-emerald-700 mb-6"></div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                            Excellence<br />
                            Across<br />
                            Disciplines
                        </h2>
                    </div>

                    {/* RIGHT - CONTENT */}
                    <div className="lg:col-span-2 space-y-6">
                        <p className="text-gray-700 text-lg leading-relaxed text-justify">
                            At Loyola College of Social Sciences, our departments represent the
                            breadth and depth of academic inquiry in the social sciences and allied
                            fields. Each department is led by distinguished faculty members who bring
                            expertise, research excellence, and a commitment to student success.
                        </p>
                        <p className="text-gray-700 text-lg leading-relaxed text-justify">
                            From traditional social sciences to emerging disciplines in technology and
                            business, our departments provide students with rigorous academic
                            training and practical experience that prepares them for leadership roles in
                            their chosen fields.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
