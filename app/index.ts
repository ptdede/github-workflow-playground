import lodash from "lodash";

const runApp = () => {
  // Uncomment this will make eslint error.
  // console.log("This will error on PR check");
  const nestedObj = {
    depth1: {
      depth2: {
        value: "value",
      },
    },
  };
  const value = lodash.get(nestedObj, "depth1.depth2.value");
  return value;
};

runApp();
