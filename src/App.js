import React, { useState, useEffect } from "react";

function App() {
    const [loading, setLoading] = useState(true); // Loading cho iframe
    const [checkId, setCheckId] = useState(""); // ID để kiểm tra
    const [result, setResult] = useState(null); // Kết quả kiểm tra
    const [scammerList, setScammerList] = useState({}); // Danh sách scammer từ JSON
    const [jsonError, setJsonError] = useState(null); // Lỗi khi tải JSON

    // Fetch danh sách scammer từ file JSON khi component mount
    useEffect(() => {
        fetch("/scammers.json")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Không thể tải danh sách scammer");
                }
                return response.json();
            })
            .then((data) => {
                setScammerList(data);
                setJsonError(null);
            })
            .catch((error) => {
                console.error("Lỗi khi tải danh sách scammer:", error);
                setJsonError(
                    "Không thể tải danh sách lừa đảo. Vui lòng thử lại sau."
                );
            });
    }, []);

    const handleIframeLoad = () => {
        setLoading(false);
    };

    const handleCheckId = (e) => {
        const inputValue = e.target.value; // Giữ nguyên giá trị nhập vào (bao gồm khoảng trắng)
        setCheckId(inputValue);

        // Trim khi xử lý logic kiểm tra
        const id = inputValue.trim();

        if (id && scammerList[id]) {
            setResult(
                `Cảnh báo: ID ${id} thuộc về ${scammerList[id]} - một kẻ lừa đảo đã biết!`
            );
        } else if (id) {
            setResult(`ID ${id} không nằm trong danh sách lừa đảo đã biết.`);
        } else {
            setResult(null);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh", // Chiều cao tối thiểu bằng màn hình
                display: "flex",
                flexDirection: "column",
                fontFamily: "Arial, sans-serif",
                padding: "20px",
                margin: "0 auto",
                maxWidth: "800px", // Tăng maxWidth cho màn hình lớn
                width: "100%", // Chiếm toàn bộ chiều rộng
                boxSizing: "border-box", // Đảm bảo padding không làm vượt kích thước
            }}
        >
            {/* Nội dung chính */}
            <main style={{ flex: "1" }}>
                <h2
                    style={{
                        color: "#333",
                        fontSize: "clamp(1.5rem, 5vw, 2rem)", // Font size co giãn
                        marginBottom: "10px",
                        textAlign: "center",
                    }}
                >
                    Tìm ID Facebook & Kiểm Tra Lừa Đảo
                </h2>
                <p
                    style={{
                        color: "#555",
                        fontSize: "clamp(0.9rem, 3vw, 1rem)",
                        marginBottom: "15px",
                        textAlign: "center",
                    }}
                >
                    Film & Digital
                </p>
                <p
                    style={{
                        color: "#28a745",
                        fontSize: "clamp(0.9rem, 3vw, 1rem)",
                        marginBottom: "10px",
                        backgroundColor: "#e9f7e9",
                        padding: "8px",
                        borderRadius: "5px",
                        display: "inline-block",
                    }}
                >
                    Tổng số Scammer được cập nhật:{" "}
                    {Object.keys(scammerList).length} người
                </p>
                {/* Loading spinner */}
                {loading && (
                    <div style={{ margin: "20px 0" }}>
                        <p style={{ color: "#555" }}>
                            Đang tải công cụ tìm ID...
                        </p>
                        <div
                            style={{
                                border: "4px solid #f3f3f3",
                                borderTop: "4px solid #007bff",
                                borderRadius: "50%",
                                width: "30px",
                                height: "30px",
                                animation: "spin 1s linear infinite",
                                margin: "0 auto",
                            }}
                        />
                    </div>
                )}

                <h2>1. Tìm ID Facebook qua link</h2>
                {/* Nhúng iframe từ findidfb.com */}
                <iframe
                    src="https://findidfb.com/"
                    title="Trình Tìm ID Facebook"
                    width="100%"
                    height="400px"
                    style={{
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        display: loading ? "none" : "block",
                        minHeight: "500px", // Đảm bảo chiều cao tối thiểu
                    }}
                    onLoad={handleIframeLoad}
                />
                {/* Ô input để kiểm tra ID */}
                <div style={{ marginTop: "20px" }}>
                    <h2
                        style={{
                            fontSize: "clamp(1.2rem, 4vw, 1.5rem)",
                            marginBottom: "10px",
                        }}
                    >
                        2. Kiểm Tra ID Facebook đó có phải là Scammer
                    </h2>
                    <input
                        type="text"
                        placeholder="Dán ID Facebook ở trên vào đây để kiểm tra"
                        value={checkId}
                        onChange={handleCheckId}
                        style={{
                            padding: "12px",
                            width: "100%",
                            maxWidth: "400px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            fontSize: "clamp(0.9rem, 3vw, 1rem)",
                            boxSizing: "border-box",
                        }}
                    />
                </div>
                {/* Hiển thị lỗi khi tải JSON */}
                {jsonError && (
                    <p
                        style={{
                            color: "red",
                            marginTop: "10px",
                            fontSize: "clamp(0.9rem, 3vw, 1rem)",
                        }}
                    >
                        {jsonError}
                    </p>
                )}
                {/* Hiển thị kết quả kiểm tra */}
                {result && (
                    <p
                        style={{
                            marginTop: "10px",
                            fontSize: "clamp(0.9rem, 3vw, 1rem)",
                            color: result.includes("Cảnh báo")
                                ? "red"
                                : "#28a745",
                        }}
                    >
                        {result}
                    </p>
                )}
            </main>

            {/* Footer */}
            <footer
                style={{
                    marginTop: "20px",
                    padding: "10px 0",
                    borderTop: "1px solid #ccc",
                    color: "#555",
                    fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)",
                }}
            >
                <p>
                    Muốn kiểm tra thêm số tài khoản ngân hàng người đó? Truy cập{" "}
                    <a
                        href="https://check-legit.onrender.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#007bff", textDecoration: "none" }}
                        onMouseOver={(e) =>
                            (e.target.style.textDecoration = "underline")
                        }
                        onMouseOut={(e) =>
                            (e.target.style.textDecoration = "none")
                        }
                    >
                        https://check-legit.onrender.com/
                    </a>
                </p>
                <p>
                    Nếu cần tố cáo hay có vấn đề, vui lòng liên hệ qua email:{" "}
                    <a
                        href="mailto:kinnguyendang@gmail.com"
                        style={{ color: "#007bff", textDecoration: "none" }}
                        onMouseOver={(e) =>
                            (e.target.style.textDecoration = "underline")
                        }
                        onMouseOut={(e) =>
                            (e.target.style.textDecoration = "none")
                        }
                    >
                        kinnguyendang@gmail.com
                    </a>
                </p>
            </footer>

            {/* CSS animation cho spinner */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @media (max-width: 600px) {
                    iframe {
                        height: 350px; // Giảm chiều cao trên màn hình nhỏ
                    }
                }
            `}</style>
        </div>
    );
}

export default App;
