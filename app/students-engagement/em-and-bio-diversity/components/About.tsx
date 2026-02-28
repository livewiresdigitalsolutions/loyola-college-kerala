export default function About() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
      <div className="flex flex-col md:flex-row gap-10 md:gap-16">
        <div className="md:w-[300px] shrink-0">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            Environment Management
          </h2>
          <div className="w-14 h-1 bg-[#13432C] rounded-full mt-4"></div>
        </div>

        <div className="flex-1 pl-0 md:pl-10">
          <p className="text-gray-600 text-[15px] leading-[1.85] mb-6">
            A permanent feature of Loyola College is its initiative and participation in maintaining
            the eco-friendly nature of the campus. It became a usual sight in the college that every
            Wednesdays the students as well as the staff members are together working to maintain the
            greenery.
          </p>

          <p className="text-gray-600 text-[15px] leading-[1.85] mb-6">
            The entire NSS volunteers are grouped into four for this purpose and a voluntary leader
            and two staff guides were given to each group. The NSS Programme Officer will be the
            overall Co-ordinator of the programme and he/she is assisted by the student Co-ordinator.
          </p>

          <p className="text-gray-600 text-[15px] leading-[1.85]">
            Every week the groups take the turn to clean up the campus and when the work is over
            after hour refreshments were provided to all the participants.
          </p>
        </div>
      </div>
    </section>
  );
}
