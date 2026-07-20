export default function Introduction() {
  return (
    <section id="introduction" className="bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-sky-950 mb-6">Who We Are?</h1>
      <div className="space-y-6">
        <p className="text-xl text-gray-700">
          <strong className="text-sky-950">AWS Educate Ambassadors:</strong>
        </p>
        <p className="text-lg text-gray-700">
          We are a vibrant community of students who are deeply passionate about AWS cloud
          technologies. Our mission is to foster innovation, empower peers, and share knowledge
          about cloud computing, artificial intelligence, and modern software development practices.
          Through workshops, hackathons, and mentorship initiatives, we aim to create opportunities
          for students to excel in their tech careers.
        </p>
        <p className="text-lg text-gray-700">
          As ambassadors, we bridge the gap between academic learning and real-world applications.
          By collaborating with AWS professionals and the global tech community, we not only learn
          cutting-edge skills but also inspire others to embrace the future of technology.
        </p>
        <p className="text-xl text-gray-700">
          <strong className="text-sky-950">About Dev Team:</strong>
        </p>
        <p className="text-lg text-gray-700">
          Founded in April 2024, the Dev Team was established as a specialized group within the AWS
          Educate Ambassadors. Our focus lies in leveraging technology to improve operational
          efficiency and streamline program activities. We tackle real-world challenges such as
          managing bulk Discord invitations, generating custom certificates, and automating
          communication for large-scale events.
        </p>
        <p className="text-lg text-gray-700">
          The Dev Team prides itself on its ability to adapt and innovate. By combining technical
          expertise and a strong collaborative spirit, we develop scalable solutions that directly
          impact the success of the AWS Educate program. Whether it&apos;s creating tools to
          simplify workflows or offering technical support to the community, we are committed to
          driving excellence in everything we do.
        </p>
        <p className="text-lg text-gray-700">
          Together, the AWS Educate Ambassadors and the Dev Team are shaping the future of cloud
          education, one project at a time.
        </p>

        <div className="rounded-xl border border-sky-100 bg-sky-50/70 p-6">
          <h2 className="text-2xl font-semibold text-sky-950">2026 Highlights</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <p className="text-sm font-medium uppercase tracking-wide text-sky-900/70">
                Product Updates
              </p>
              <ul className="mt-3 space-y-2 text-base text-gray-700">
                <li>2026/07: Introduced DLQ handling flow for better recovery and stability.</li>
                <li>2026/08: Rolled out RSVP Service for attendance collection and confirmation.</li>
              </ul>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <p className="text-sm font-medium uppercase tracking-wide text-sky-900/70">
                Delivery Impact
              </p>
              <p className="mt-3 text-base text-gray-700">
                Between 2025/10 and 2026/05, TPET supported 8,326 email deliveries, including
                8,120 general emails and 206 participation certificates. The largest single
                campaign reached 2,139 recipients.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
