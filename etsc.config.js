module.exports = {
  esbuild: {
    minify: false,
    target: "es2016",
  },
  postbuild: async () => {
    const cpy = (await import("cpy")).default;
    await cpy(
      [
        "src/**/*.graphql", // Copy all .graphql files
        "!src/**/*.{tsx,ts,js,jsx}", // Ignore already built files
      ],
      "dist"
    );
  },
};