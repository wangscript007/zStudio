function ict_framework_func1(word){  
         var a1 = CryptoJS.enc.Utf8.parse(ict_framework_aes_a1);   
         var a2  = CryptoJS.enc.Utf8.parse(ict_framework_aes_a2);   
		 var srcs = CryptoJS.enc.Utf8.parse(word);  
         var encrypted = CryptoJS.AES.encrypt(srcs, a1, { iv: a2,mode:CryptoJS.mode.CBC});  
         return encrypted.toString();  
}
  
function ict_framework_func2(word){  
        var a1 = CryptoJS.enc.Utf8.parse(ict_framework_aes_a1);   
        var a2  = CryptoJS.enc.Utf8.parse(ict_framework_aes_a2);   
        var decrypt = CryptoJS.AES.decrypt(word, a1, { iv: a2,mode:CryptoJS.mode.CBC});  
        return CryptoJS.enc.Utf8.stringify(decrypt).toString();  
} 







var ict_framework_aes_a1 = "9763853428462486";
var ict_framework_aes_a2 = "9763853428462486";