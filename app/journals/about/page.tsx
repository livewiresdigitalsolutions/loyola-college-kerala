import React from "react";
import Breadcrumbs from "../_components/Breadcrumbs";

export default function AboutPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/journals" },
    { label: "About Us" },
  ];

  return (
    <main className="min-h-screen bg-background pt-36 pb-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-12 text-foreground/80">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Section: About Us */}
        <section className="flex flex-col gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            About Us
          </h1>
          <div className="flex flex-col gap-4 leading-relaxed">
            <p>
              Published since 1987, Loyola Journal of Social Sciences is a
              multidisciplinary, peer-reviewed biannual published by Loyola
              College of Social Sciences, Thiruvananthapuram, Kerala, which is
              an accredited institution at the FIVE STAR level (2001),
              Re-accredited at ‘A’ Grade with CGPA of 3.70 out of 4.00 (2007)
              and again Re-accredited at ‘A’ Grade with CGPA of 3.72 out of 4.00
              (2014) by the National Assessment and Accreditation Council
              (NAAC), India.
            </p>
            <p className="italic text-sm text-muted-foreground">
              (select 198766*667891 from DUAL)
            </p>
            <p>
              The journal is abstracted/indexed in: All India Index to
              Periodical Literature in English (AIIPLE) CSA Sociological
              Abstracts, CSA Worldwide Political Science Abstracts Social
              Services Abstracts and the International Bibliography of the
              Social Science (IBSS).
            </p>
          </div>
        </section>

        {/* Section: Aims and Scope */}
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-primary">Aims and Scope</h2>
          <div className="flex flex-col gap-4 leading-relaxed">
            <p>
              Loyola Journal is a bi-annual publication aimed to disseminate
              empirical research papers or original articles in the areas of
              social sciences. It accepts papers in the broad areas of
              sociology, anthropology, social work, psychology, management and
              economics. It also encourages inter-disciplinary ideas related to
              areas of social sciences.
            </p>
            <p>
              The journal is available both in print and online formats. To
              submit an article please follow the author guidelines. The authors
              can submit the articles through the online submission procedures.
              For this please follow the link….
            </p>
          </div>
        </section>

        {/* Section: Author Guidelines */}
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-primary">Author Guidelines</h2>
          <div className="flex flex-col gap-4 leading-relaxed">
            <p>
              Articles of theoretical and empirical nature are welcomed in the
              areas of Social Science. Please send the submissions by email
              attachment to{" "}
              <a
                href="mailto:loyolajournal1987@gmail.com"
                className="text-primary hover:underline"
              >
                loyolajournal1987@gmail.com
              </a>
              . Submissions made must contain three attachments - 1) the article
              2) a signed declaration that it has not been published or
              submitted for publication elsewhere and 3) full correspondence
              details of the author/s such as official address, affiliation of
              institution, telephone number, fax and email.
            </p>
            <ul className="list-disc pl-5 space-y-2 marker:text-primary">
              <li>
                First author is considered as corresponding author with maximum
                of 3 authors.
              </li>
              <li>
                Article must be original and unpublished and between 6,000-8,000
                words.
              </li>
              <li>
                Provide an abstract of 250 words along with 4-6 keywords at the
                end of it.
              </li>
              <li>
                Keep all the tables and figures at the end of the paper citing
                appropriate locations in the text.
              </li>
              <li>
                Maps & Photographs to be given in jpeg format. These will be
                presented in black & white.
              </li>
              <li>
                Notes must be endnotes and numbered serially at the end of the
                article and not at the bottom of the page.
              </li>
              <li>
                Provide references in the text with author, year and page number
                in parenthesis. example: (Srinivas,1966:170).
              </li>
              <li>
                Accurate bibliography, not numbered, to be placed at end of
                text, max. of 3 pages.
              </li>
            </ul>

            <div className="bg-muted/10 p-6 rounded-lg border border-border mt-4">
              <h3 className="font-bold mb-4">Bibliography Format Examples:</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="font-semibold block">a) Books:</span>
                  Srinivas, M. N. 1996. Social Change in Modern India. Berkely:
                  University of California Press.
                </div>
                <div>
                  <span className="font-semibold block">
                    b) Journal Articles:
                  </span>
                  Pettigrew, T.F. 2008. “Future Directions for Intergroup
                  Contact: Theory and Research”. International Journal of
                  Intercultural Relations 32 (3): 187-99.
                </div>
                <div>
                  <span className="font-semibold block">
                    c) Newspaper Articles:
                  </span>
                  Balchand, K. 2009.“Quota for Women in all tiers of Panchayat
                  Raj”, The Hindu, Aug.28. p.4.
                </div>
                <div>
                  <span className="font-semibold block">
                    d) Edited Volumes:
                  </span>
                  Curson, P. 1989. ‘Paradise Delayed: Epidemics of Infectious
                  Disease in the Industrialized World’. In: J. Clarke , P.
                  Curson, S.L. Kayastha, and P. Nag (eds). Population and
                  Disaster (159-79). Oxford: Blackwell.
                </div>
                <div>
                  <span className="font-semibold block">
                    e) Internet Sources:
                  </span>
                  Eg.: Swain, R. B., 2004. “Is Microfinance a Good Poverty
                  Alleviation Strategy?: Evidence from Impact
                  Assessment”.www.microfinancegateway.org/p/site/m/template.
                  rc/1.9.25049. [Accessed: 15 May 2013].
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-bold mb-2">Presentation of Text:</h3>
              <ul className="list-alpha pl-5 space-y-2">
                <li>
                  <span className="font-semibold">a) Font:</span> Univers 10 pt
                  for the main text, 9 pt for notes, acknowledgements, and
                  references.
                </li>
                <li>
                  <span className="font-semibold">b) Spacing:</span> Double line
                  for the text, single line for tables.
                </li>
                <li>
                  <span className="font-semibold">c) Tables:</span> Numbered and
                  placed at the end of text, indicating position within text.
                  Use table function of MS Word. Hide column lines. Only row
                  lines for row titles and at the bottom. Both column and row
                  titles italicized. Digits in the table are right aligned,
                  rounded up to two decimals.
                </li>
                <li>
                  <span className="font-semibold">
                    d) Figure number and title:
                  </span>{" "}
                  to be placed outside the figure box, inside text universe 8 pt
                  or less.
                </li>
                <li>
                  <span className="font-semibold">e) Footnotes:</span> Do not
                  use the function in word formatting software. Notes should be
                  a separate section at the end of the paper, before References.
                  Number(superscript) them in the text.
                </li>
                <li>
                  <span className="font-semibold">f) Spelling:</span> British,
                  and ‘s’ not ‘z’.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section: Publication Policy */}
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-primary">
            Publication Policy
          </h2>
          <p>
            The publication process of Loyola Journal of Social Sciences is as
            follows:
          </p>
          <ol className="list-decimal pl-5 space-y-3 marker:font-bold marker:text-primary">
            <li>
              When an author submits a manuscript to the journal, editor will
              acknowledge within three business days. Editor then checks whether
              the manuscript is original, scientific in nature, and meets the
              preferences and standards of the journal even in terms of themes
              (socially relevant) and presentation (word count, structure and
              format). The editor will also check whether the references are
              formatted as per APA style which is on the website.
            </li>
            <li>
              If everything in item 1 is okay, the editor will verify whether
              the author(s) has submitted a signed declaration that it has not
              been previously published or submitted elsewhere simultaneously.
            </li>
            <li>
              The editor then checks the manuscript for its originality through
              a plagiarism checking mechanism.
            </li>
            <li>
              The manuscript does not undergo the review process until all the
              conditions in items 1, 2 and 3 are met.
            </li>
            <li>
              The editor identifies two experts for review of the manuscript
              without revealing the authors’ name. The reviewer is expected to
              send the review within two months on the template (see
              attachment).
            </li>
            <li>
              If the reviewers have asked for revision, send the reviews (double
              blind, i.e., neither the reviewers nor the authors know each
              other) to the authors for correction and resubmission within 2-4
              weeks.
            </li>
            <li>
              Once the revised submissions are received the editor checks
              whether the authors have addressed all recommendations of the
              reviewers. If not, the manuscript is returned to the author for
              another round of revision, it is to be re-submitted within four
              days.
            </li>
            <li>
              If the editor is happy with the resubmission he does the editing
              at this stage for uniformity and alignment, and looks for any gaps
              in the manuscript such as incorrect figures, statistics,
              references etc. All the references cited in the text should be
              listed in the references section.
            </li>
            <li>
              The editor after his editing and formatting send it to the
              copy-editor (one who is an excellent English teacher for grammar
              and style, and who knows the standard of scientific writing).
            </li>
            <li>
              When the copy-edited manuscript is received by the editor, he/she
              sends the acceptance email to the author with the final proof of
              the manuscript. The authors at this stage have to return the
              signed copyright form (See attachment) and the checked proof
              within 48 hours.
            </li>
            <li>
              When a minimum of 5 manuscripts are ready in about 100-120 printed
              pages, the issue is set, formatted, proof-read and send to the
              press for printing.
            </li>
            <li>
              Authors are send a copy of the journal and the pdf copy of their
              individual manuscript once the issue is released.
            </li>
            <li>
              The issue of the journal should be out before June and December
              every year.
            </li>
          </ol>
        </section>

        {/* Section: Ethical Policy */}
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-primary">Ethical Policy</h2>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Obligations of Editor</h3>
            <p>
              The editor of Loyola Journal of Social Sciences commits the
              following:
            </p>
            <ul className="list-disc pl-5 space-y-2 marker:text-primary">
              <li>
                Respond to submissions of manuscript without delay with a
                commitment to accept the ones meeting the standards, relevance
                and format of the journal
              </li>
              <li>
                Identify reviewers depending on their areas of competency to
                review the manuscript in the subjects concerned.
              </li>
              <li>
                Maintain proper communication with authors, reviewers and other
                stakeholders.
              </li>
              <li>
                Provide fair and unbiased decisions on review of manuscripts by
                sharing adequate information on the revision or rejection.
              </li>
              <li>Follow the ethical policy of the journal.</li>
              <li>
                Make sure that the papers published in the journal never hurt
                the sentiments or violate the rights of anybody based on
                religion, caste or gender.
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <h3 className="font-bold text-lg">Obligations of Author(s)</h3>
            <p>
              The authors contributing manuscripts to Loyola Journal of Social
              Sciences agrees to the following commitments:
            </p>
            <ul className="list-disc pl-5 space-y-2 marker:text-primary">
              <li>
                Be diligent to submit a manuscript which is original, in
                required format and referencing style of the journal.
              </li>
              <li>
                Disclose their identity by sharing their name, affiliations and
                contact details.
              </li>
              <li>
                To submit the manuscript, which meets the standards, relevance
                and format of the Loyola Journal.
              </li>
              <li>
                Reveal conflicts of interests, if any while submitting the work
                and acknowledges funding information (if applicable).
              </li>
              <li>
                Hand over the copy right form to the editor on acceptance of the
                manuscript for publication in the journal.
              </li>
              <li>
                Admit the decisions regarding the revision or rejection of the
                manuscript.
              </li>
              <li>Sustain good communication with co-authors and editor.</li>
              <li>
                Understands the responsibilities as a corresponding author by
                ensuring accurate submission of author information, getting
                consent from co-authors for submission as well as sharing
                appropriate information between editor and co-authors.
              </li>
              <li>
                Update any change to the authorship after submission in writing
                with an agreement document which is signed by every author.
              </li>
              <li>
                Refrain from submitting a manuscript having copied materials
                from other published sources/materials.
              </li>
            </ul>
          </div>
        </section>

        {/* Section: Plagiarism Policy */}
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-primary">Plagiarism Policy</h2>
          <p>
            All manuscripts will be checked for its originality by way of a
            plagiarism checking mechanism. Based on which the editor may reject
            the manuscript if it contains similarity with other works at higher
            level. If there are limited contents of similarity the editor may
            ask for revision of the respective paragraphs. The plagiarism check
            includes self-plagiarism also.
          </p>
        </section>

        {/* Section: ISSN */}
        <section className="flex flex-col gap-2 border-t pt-8 border-border">
          <p className="font-bold">ISSN and Indexing</p>
          <p>ISSN 0971-4960</p>
          <p className="text-sm text-muted-foreground">
            The Journal is abstracted/indexed in: All India Index to Periodical
            Literature in English (AIIPLE), CSA Sociological Abstracts, CSA
            Worldwide Political Science Abstracts Social Services Abstracts and
            the International Bibliography of the Social Science (IBSS)
          </p>
        </section>
      </div>
    </main>
  );
}
