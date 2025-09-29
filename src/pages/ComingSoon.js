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
            fontSize: "3rem",
            marginBottom: "0.5rem",
            fontWeight: "700",
          }}
        >
          MyProfession.CA
        </h1>

        <h2
          style={{
            fontSize: "1.8rem",
            marginBottom: "1rem",
            color: "#9ca3af",
            fontWeight: "400",
          }}
        >
          Launching Soon 🚀
        </h2>

        <p
          style={{
            fontSize: "1rem",
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
