// 🎯 ESTILOS MEDIEVAIS GERAIS
// ESTILO IDÊNTICO À IMAGEM
export const medievalCard = {
    outer: {
        background: "linear-gradient(#eeddb9, #e3cfa2)",
        borderRadius: "18px",
        border: "3px solid #b38a56",
        padding: "12px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
        fontFamily: "'Times New Roman', serif",
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

    title: {
        fontFamily: "'Times New Roman', serif",
        fontWeight: "bold",
        color: "#3d2b1a",
        fontSize: "1.4rem",
        textTransform: "uppercase",
        marginBottom: "6px",
    },

    contentBox: {
        background: "transparent",
        padding: "14px",
        paddingTop: "6px",
    },

    divider: {
        width: "100%",
        height: "2px",
        background: "#8e6b42",
        margin: "4px 0 12px 0",
    },

    authorRow: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginTop: "12px",
        color: "#3d2b1a",
        fontWeight: "bold",
    },

    badgePublished: {
        color: "green",
        fontWeight: "bold",
        marginTop: "4px",
        fontSize: "0.9rem",
    }
};

export const medievalCreatePosts = {
    header: {
        fontFamily: "'Times New Roman', serif",
        fontWeight: "bold",
        color: "#4b2f18",
        mb: 3,
    },
    box: {
        background: "linear-gradient(#f7e9c8, #e8d6a3)",
        borderRadius: "16px",
        //border: "3px solid #8b5a2b",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        p: 3,
        mb: 4,
        fontFamily: "'Times New Roman', serif",
    },
    title: {
        fontFamily: "'Times New Roman', serif",
        color: "#3d2b1a",
        fontWeight: "bold",
        textTransform: "uppercase",
        mb: 6,
        letterSpacing: "1px",
    },
    textField: {
        "& .MuiInputBase-root": {
            background: "#fff8e5",
            borderRadius: "6px",
            border: "1px solid #c0a276",
            fontFamily: "'Times New Roman', serif",
        },
        "& input": {
            color: "#3d2b1a",
            fontWeight: "bold",
        },
        "& label": {
            fontFamily: "'Times New Roman', serif",
            color: "#4b3724",
            fontWeight: "bold",
        },
    },
    button: {
        mt: 3,
        px: 3,
        py: 1,
        background: "#6b4a2e",
        ":hover": { background: "#4a331f" },
        borderRadius: "8px",
        boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
        fontFamily: "'Times New Roman', serif",
        fontWeight: "bold",
        letterSpacing: "1px",
        textTransform: "uppercase",
    },

    titlePost: {
        fontFamily: "'Times New Roman', serif",
        fontWeight: "bold",
        color: "#4b2f18",
        mt: 12,
        mb: 12,
    }
}