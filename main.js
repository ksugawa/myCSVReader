const file = "./xlsx/sample.csv";
const config = "config.json";

const initialize = async () => {
  const csvText = await fetchCSV(file);
  const jsonConfig = await fetchConfig(config);
  const data = await parseCSV(csvText, jsonConfig);
  console.log(data);
  console.log(jsonConfig);
};

const fetchCSV = async (file) => {
  const response = await fetch(file);
  const csvText = await response.text();
  return csvText;
};

const fetchConfig = async (file) => {
  const response = await fetch(file);
  const jsonConfig = await response.json();
  return jsonConfig;
};

const parseCSV = async (csvText, jsonConfig) => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields; // ヘッダー情報を取得
        const parsedData = results.data;
        const updatedData = setData(parsedData, headers, jsonConfig);
        resolve(updatedData);
      },
      error: () => {
        reject(new Error("csv parse err"));
      },
    });
  });
};

const setData = (data, headers, config) => {
    const headerMapping = {};
    
    headers.forEach((header) => {
      // config.main.headers に対応するキーが存在するか確認
      if (config.main.headers[header]) {
        headerMapping[header] = config.main.headers[header];
      } else {
        headerMapping[header] = header; // configに無ければ元のヘッダーを使用
      }
    });
  
    const updatedData = data.map(row => {
      const newRow = {};
      Object.keys(row).forEach(key => {
        const newHeader = headerMapping[key];
        newRow[newHeader] = row[key];
      });
      return newRow;
    });
  
    return updatedData;
  };

initialize();
