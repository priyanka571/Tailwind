function hideAllSections(){
    document.getElementById("addForm").classList.add("hidden");
    document.getElementById("productList").classList.add("hidden");
    document.getElementById("deleteSection").classList.add("hidden");

}
let openRequest = indexedDB.open("Products",1);
console.log(openRequest);
let db;
let storeObject;

openRequest.onsuccess = (e) =>{
    console.log("from success");
    db = openRequest.result;

}


openRequest.onupgradeneeded = (e) =>{
    console.log("upgrade needed");

    db = openRequest.result;
    if(!db.objectStoreNames.contains("Products")){
        let request = db.createObjectStore("Products",{keyPath:'id'})
        request.createIndex("name","name",{unique:false});
        request.createIndex("price","price",{unique : false});
    }

}

openRequest.onerror = (e) =>{
    console.log('Error :',e);
}



 function addProduct(){
        hideAllSections();
        document.getElementById("addForm").classList.remove("hidden");
        const name= document.getElementById('name').value;
        const price = document.getElementById('price').value;
        let transaction = db.transaction("Products","readwrite")
         storeObject = transaction.objectStore("Products");
        let request = storeObject.add({
           id : Date.now(),
           name : name,
           price : Number(price)
        });
        if (name.trim() === "" || price ===""){
            alert("please fill all field");
            return;
        }
       
        request.onsuccess = () => {
             alert("Item added successfully");
             document.getElementById('name').value="";
             document.getElementById('price').value="";

          console.log("Added");
        };
        
    request.onerror = (e) => {
        console.log(e.target.error);
    }
}
     
function getProduct(){
    hideAllSections();
    document.getElementById("productList").classList.remove("hidden");
    let transaction = db.transaction("Products","readwrite")
    storeObject = transaction.objectStore("Products");
    let request = storeObject.getAll();

    request.onsuccess = (e) => {
        // console.log(e.target.result);
        let products = e.target.result;
        let output = "";
        products.forEach((product) => {
            output += `
            <tr>
                <td class="border p-2">${product.id}</td>
                <td class="border p-2">${product.name}</td>
                <td class="border p-2">₹${product.price}</td>
                 <td class="border p-2 text-center">
                    <button
                        onclick="delProduct(${product.id})"
                        class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                        Delete
                    </button>
                </td>
            </tr>

                `;
        });
        // document.getElementById("productList").innerHTML = output;
        document.getElementById("productTableBody").innerHTML = output;
    };
    
    request.onerror = (e) => {
        console.log(e.target.error);
    }
} 
function delProduct(id){
    // hideAllSections();
    // document.getElementById("deleteSection").classList.remove("hidden");

    // const produuctName = document.getElementById('name').value;
    let transaction = db.transaction("Products","readwrite")
    storeObject = transaction.objectStore("Products");
    // let nameIndex = storeObject.index("name");
    let request = storeObject.delete(id);

    request.onsuccess = (e) => {
        // let product = e.target.result;
        //  if (!product) {
        //     console.log("Product not found");
        //     return;
        // }
        alert("Product deleted successfully");
        getProduct(); 
        // let delRequest = storeObject.delete(product.id);
        // delRequest.onsuccess = () => {
        //     console.log("Deleted");
        // };
    }; 
    request.onerror = (e) => {
        console.log(e.target.error);
    };

    
}
function manage(){
                const menu = document.getElementById("menu");
                menu.classList.toggle("hidden");
            }
function showAddForm(){
                document.getElementById("addForm")
                .classList.remove("hidden");

}
       