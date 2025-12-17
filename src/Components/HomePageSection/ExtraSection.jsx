import Container from "../Shared/Container";

const stages = [
  "Cutting Completed",
  "Sewing Started",
  "Finishing",
  "QC Checked",
  "Packed & Shipped",
];

const ExtraSection = () => {
  return (
    <section className="bg-green-600 py-20 text-white">
      <Container>
        <h2 className="text-3xl font-bold text-center mb-10">
          Production Stages Tracking
        </h2>

        <div className="flex flex-wrap justify-center gap-6">
          {stages.map((stage, i) => (
            <div
              key={i}
              className="bg-white text-green-700 px-6 py-4 rounded-lg font-semibold shadow"
            >
              {stage}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default ExtraSection;
