export default function DevTeam() {
  return (
    <section id="dev-team" className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Journey</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-semibold text-blue-600 mb-2">Origins</h3>
          <p className="text-lg text-gray-700">
            Founded on April 22, 2024, by the 6th cohort of ambassadors, the Dev Team was created to
            address challenges such as handling bulk Discord invites, certificate generation, and
            custom email campaigns.
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-blue-600 mb-2">Core Team Members</h3>
          <ul className="list-disc pl-5 text-lg text-gray-700">
            <li>
              <strong>Shiun:</strong> Backend/DevOps
            </li>
            <li>
              <strong>Richie:</strong> Backend
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-blue-600 mb-2">Key Milestones</h3>
          <ul className="space-y-2">
            {[
              { date: "2024/03", event: "Built DC infrastructure and batch invite systems." },
              { date: "2024/04/08", event: "Generated custom participation certificates for UAD." },
              { date: "2024/04/22", event: "Official establishment of Dev Team." },
              { date: "2024/04 Mid", event: "Delivered custom emails to 1,000+ participants." },
            ].map((milestone, index) => (
              <li key={index} className="flex items-start">
                <span className="font-semibold text-blue-600 mr-2">{milestone.date}:</span>
                <span className="text-gray-700">{milestone.event}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
