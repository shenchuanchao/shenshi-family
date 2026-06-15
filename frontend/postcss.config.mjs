const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    "postcss-preset-env": {
      stage: 2,
      features: {
        "cascade-layers": true,
        "color-mix": true,
        "oklab-function": true,
        "nesting-rules": true,
      },
      browsers: [
        "> 0.5%",
        "last 2 versions",
        "iOS >= 13",
        "Android >= 5",
        "not dead",
      ],
    },
  },
};

export default config;
