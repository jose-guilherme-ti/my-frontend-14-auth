


export const medievalPostPublicados = (highlight?: boolean) => ({
    postCardWrapper: {
        background: "#fdf4e3",
        border: highlight ? "3px solid #c59b5f" : "3px solid #e7d1ac",
        borderRadius: "14px",
        padding: "12px",
        position: "relative",
        transition: "transform 150ms ease-out, border-color 400ms",
        transform: highlight ? "scale(1.03)" : "scale(1)",
        boxShadow: highlight
            ? "0 0 12px rgba(197, 155, 95, 0.9)"
            : "0px 3px 8px rgba(0, 0, 0, 0.15)",
    },
    highlight: {
        position: "absolute",
        top: -8,
        right: -8,
        fontWeight: "bold",
        borderRadius: "10px",
        background: "#ffcb4c",
        color: "#5a3f1f",
        boxShadow: "0px 3px 5px rgba(0,0,0,0.3)"
    }
})



export const medievalPostCards = (highlight?: boolean) => ({
    card: {
        background: "linear-gradient(145deg, #f7e7c3, #d9c89a)",
        border: "3px solid #8b6a3e",
        borderRadius: "12px",
        boxShadow: highlight
            ? "0 0 20px 6px rgba(255, 215, 0, 0.9)"
            : "0 3px 8px rgba(0,0,0,0.4)",
        transition: "0.3s ease",
        transform: highlight ? "scale(1.05)" : "scale(1)",
        position: "relative",
    },
    highlight: {
        position: "absolute",
        top: 8,
        right: 8,
        fontWeight: "bold",
        bgcolor: "#ffd700",
        color: "#4b2900",
        border: "2px solid #4b2900",
    },
    header: {
        background: "#e4c99b",
        borderRadius: "10px",
        textAlign: "center",
        padding: "6px 0",
        borderBottom: "2px solid #b38a56",
        fontFamily: "'Times New Roman', serif",
        fontWeight: "bold",
        color: "#3d2b1a",
        textTransform: "uppercase",
        fontSize: "1rem",
    },
    content: {
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "1.05rem",
        color: "#3b2604",
        mb: 2,
    }
})