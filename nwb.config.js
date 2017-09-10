module.exports = {
    type: "react-component",
    npm: {
        esModules: true,
        umd: {
            global: "ReactOffline",
            externals: {
                react: "React"
            }
        }
    }
};
