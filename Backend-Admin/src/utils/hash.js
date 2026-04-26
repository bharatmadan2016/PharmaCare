const bcrypt = require("bcrypt")
const saltRounds=10;


const hashPassword= async(password)=>{
    
    const bcryptPasswordGenerate = await bcrypt.hash(password,saltRounds)
    return bcryptPasswordGenerate




}
const comparePassword=async()=>{
    
    const comparePassord= await bcrypt.compare(hashCompare,plainPassword)
    return comparePassord


}
export {hashPassword,comparePassword}