// override default console info and error
const overrideConsole = () => {
  const originalDebug = console.debug;
  const originalInfo = console.info;
  const originalError = console.error;

  // overriding console.debug
  console.debug = (...rest) => {
    const args = [].slice.call(rest);
    originalDebug.apply(
      console.debug,
      [getCurrentDateString(), "--- DEBUG:"].concat(args)
    );
  };

  // overriding console.info
  console.info = (...rest) => {
    const args = [].slice.call(rest);
    originalInfo.apply(
      console.info,
      [getCurrentDateString(), "--- INFO:"].concat(args)
    );
  };

  // overriding console.error
  console.error = (...rest) => {
    const args = [].slice.call(rest);
    originalError.apply(
      console.error,
      [getCurrentDateString(), "--- ERROR:"].concat(args)
    );
  };

  // return current timestamp
  const getCurrentDateString = () => {
    const currentDate = new Date();
    return new Date(
      currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, -1)
      .replace("T", " ");
  };
};

module.exports = { overrideConsole };
