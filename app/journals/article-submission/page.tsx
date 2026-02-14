import React from "react";
import Breadcrumbs from "../_components/Breadcrumbs";
import { BookOpen } from "lucide-react";

export default function ArticleSubmissionPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/journals" },
    { label: "Article Submission" },
  ];

  return (
    <main className="min-h-screen bg-background pt-36 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Page Header */}
        <div className="flex flex-col gap-4">
          <div className="w-12 h-1 bg-primary rounded-full"></div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Article Submission
          </h1>
          <p className="text-muted-foreground text-lg">
            Submit your research for review and publication.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Registration Form */}
          <div className="lg:col-span-2">
            <div className="bg-background border border-border rounded-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                Registration For Article Submission
              </h2>

              <form className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="flex flex-col gap-2 md:col-span-1">
                    <label className="text-sm font-medium text-foreground">
                      Salutation
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-3">
                    <label className="text-sm font-medium text-foreground">
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter First Name"
                      className="w-full px-4 py-3 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Middle Name"
                      className="w-full px-4 py-3 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Last Name"
                      className="w-full px-4 py-3 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">
                    Designation
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Designation"
                    className="w-full px-4 py-3 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">
                    Affiliated With
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Affiliated With"
                    className="w-full px-4 py-3 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      Country
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Country"
                      className="w-full px-4 py-3 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      State
                    </label>
                    <input
                      type="text"
                      placeholder="Enter State"
                      className="w-full px-4 py-3 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="Enter City"
                      className="w-full px-4 py-3 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Enter email"
                      className="w-full px-4 py-3 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      Phone No
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter Phone No"
                      className="w-full px-4 py-3 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter password"
                      className="w-full px-4 py-3 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter password"
                      className="w-full px-4 py-3 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">
                    Address
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Enter Address"
                    className="w-full px-4 py-3 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  ></textarea>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="bg-[#0F392B] text-white px-8 py-3 rounded-md font-medium hover:bg-[#0F392B]/90 transition-colors"
                  >
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="flex flex-col gap-8">
            {/* Login Card */}
            <div className="bg-background border border-border rounded-lg p-6 md:p-8">
              <h2 className="text-xl font-bold text-[#0F392B] mb-2">
                Already a member?
              </h2>
              <h2 className="text-xl font-bold text-[#0F392B] mb-6">
                Login here.
              </h2>

              <form className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    className="w-full px-4 py-3 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    className="w-full px-4 py-3 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <button
                  type="button"
                  className="w-full bg-[#f8f9fa] border border-border text-[#0F392B] font-bold py-3 rounded-md hover:bg-muted transition-colors mt-2"
                >
                  Login
                </button>
              </form>
            </div>

            {/* Instructions Card */}
            <div className="bg-[#f8f9fa] border border-border rounded-lg p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <BookOpen size={20} className="text-[#0F392B]" />
                <h2 className="text-lg font-bold text-[#0F392B]">
                  Instruction for <br /> Article Submission
                </h2>
              </div>

              <div className="space-y-4 text-xs text-muted-foreground leading-relaxed">
                <div className="bg-[#F2F2F2] p-3 rounded">
                  Curson, P. 1989. 'Paradise Delayed: Epidemics of Infectious
                  Disease in the Industrialized World'. In: J. Clarke , P.
                  Curson, S.L. Kayastha, and P. Nag (eds). Population and
                  Disaster (159-79). Oxford: Blackwell.
                  <br />
                  <br />
                  <span className="font-bold text-[#0F392B]">
                    Internet Sources:
                  </span>
                  <br />
                  Apart from the details of the source it should have the
                  correct URL, and the date the source accessed.
                </div>

                <p>
                  <span className="font-bold text-[#0F392B]">Font:</span>{" "}
                  Univers 10 pt for the main text, 8 pt for notes,
                  acknowledgements, and references.
                </p>

                <p>
                  <span className="font-bold text-[#0F392B]">Tables:</span>{" "}
                  Should be numbered and show the exact location in the text.
                  use the table function of the MS Word, no column lines but
                  hide them. only row lines for row titles and a line at the
                  bottom. Both column and row titles italicized. Digits in the
                  table are right aligned, rounded up to two decimals.
                </p>

                <p>
                  <span className="font-bold text-[#0F392B]">Figures:</span>{" "}
                  Editable figures, figure number and title outside the figure
                  box, inside text in universe 8 pt or less
                </p>

                <div className="border-t border-border pt-4 mt-6 text-[10px] text-muted-foreground/80">
                  <p>
                    Printed and published by Sabu Thomas S.J., for Loyola
                    College of Social Sciences, Thiruvananthapuram-695 017,
                    Kerala, India.
                  </p>
                  <p className="mt-1">
                    Telephones: 91-471- 2590580, 2592059, 2591018. Fax:
                    91-471-2591760.
                  </p>
                  <p className="mt-1">
                    Web: www.loyolacollegekerala.edu.in; Email:
                    loyolajournal1987@gmail.com
                  </p>
                  <p className="mt-1">
                    Printed at Yuva Deepthi Press, Monvila, Thiruvananthapuram,
                    Phone: 914712598073
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
