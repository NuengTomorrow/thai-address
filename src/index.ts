const path = require('path')
const fsPromises = require('fs/promises')

const getFileData = async(file: string, byId?: number, type?: "province_id" | "amphure_id" | "zip_code") => {
  const filePath = path.join(process.cwd(), file);
  const json = await fsPromises.readFile(filePath);
  const data= JSON.parse(json  as any);
  if (!type) {
    return data
  } else {
    return data.filter((item:any) => item[type] === byId)
  }
}

const address = async (addressId = "") => { 
  let id = 0
  if (addressId !== "") {
    id = JSON.parse(addressId)
  }
  const province= await getFileData('src/address/province.json')
  const district= await getFileData('src/address/district.json', id, 'province_id')
  const subDistrict= await getFileData('src/address/sub_district.json', id, 'amphure_id')
  const zipCode= await getFileData('src/address/sub_district.json', id, 'zip_code')

  if (addressId.match(/(?<!\d)(\d{1}|\d{2})(?!\d)/i)) {
    return { results: district };
  }
  if (addressId.match(/(?<!\d)(\d{4})(?!\d)/i)) {
    return { results: subDistrict };
  }
  if (addressId.match(/(?<!\d)(\d{5})(?!\d)/i)) {
    return { results: zipCode };
  }
  else {
    return { results: province };
  }
  
}
// put string of number in fn address Ex. address("1")
// yarn start fn : yarn dev
// npm start fn : npm run dev

address().then((res) => console.log(res))