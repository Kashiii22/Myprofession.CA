import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ComingSoon() {
  return (
    <div
      style={{
        backgroundColor: "#0d1117", // dark background
        color: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Header />

      <main
        style={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "20px",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <h1
          style={{
            fontSize: "3.5rem", // Increased font size
            marginBottom: "1rem", // Adjusted margin
            fontWeight: "700",
            color: "#ffffff", // Ensured it's white for prominence
          }}
        >
          Launching Soon 🚀
        </h1>

        <p
          style={{
            fontSize: "1.1rem", // Slightly increased font size for readability
            maxWidth: "600px",
            lineHeight: "1.6",
            color: "#d1d5db",
          }}
        >
          We’re building a trusted platform for Chartered Accountancy services.
          Expect a clean, professional experience designed to simplify your
          finances with transparency and confidentiality.
        </p>
      </main>

      <Footer />
    </div>
  );
}