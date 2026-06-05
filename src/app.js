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
        event.preventDefault(); //to stop refresh
        const name= document.getElementById('name').value;
        const price = document.getElementById('price').value;
        if (name.trim() === "" || price ===""){
                    alert("please fill all field");
                    return;
        }

        let transaction = db.transaction("Products","readwrite")
         storeObject = transaction.objectStore("Products");
        let request = storeObject.add({
           id : Date.now(),
           name : name,
           price : Number(price)
        });
       
       
        request.onsuccess = () => {
             alert("Item added successfully");
             document.getElementById('name').value="";//input field empty
             document.getElementById('price').value="";//input field empty
             getProduct();
             hideAddForm();

          console.log("Added");
        };
        
    request.onerror = (e) => {
        console.log(e.target.error);
    }
}
     
function getProduct(){
    document.getElementById("productList").classList.remove("hidden");
    let transaction = db.transaction("Products","readwrite")
    storeObject = transaction.objectStore("Products");
    let request = storeObject.getAll();

    request.onsuccess = (e) => {
        
        let products = e.target.result;
        if (products.length === 0) {
                document.getElementById("productTableBody").innerHTML = `
                    <tr>
                                <td colspan="4" class="border p-4 text-center text-red-500">
                            Inventory is empty
                        </td>
                    </tr>
                `;
                return;
            }        

        let output = "";
        products.forEach((product) => {
            output += `
            <tr class="bg-white border-b hover:bg-gray-200 transition">
                <td class="p-3 text-center text-gray-700 font-medium"">${product.id}</td>
                <td class="p-3 text-center text-gray-800">${product.name}</td>
                <td class="p-3 text-center text-green-600 font-semibold">₹${product.price}</td>
                 <td class="border p-2 text-center">
                    <button
                        onclick="delProduct(${product.id})"
                        class="bg-[#3B7597] hover:bg-[#2C5EAD] text-white px-3 py-1 rounded">
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
    let transaction = db.transaction("Products","readwrite")
    storeObject = transaction.objectStore("Products");
    let request = storeObject.delete(id);

    request.onsuccess = (e) => {
        alert("Product deleted successfully");
        getProduct(); 
    }; 
    request.onerror = (e) => {
        console.log(e.target.error);
    };

    
}
function manage(){
                document.getElementById("homeSection").classList.add("hidden");
                document.getElementById("manageSection").classList.remove("hidden");
                getProduct();
                
}

function showMenu(){
    document.getElementById("menu").classList.toggle("hidden");
}

function showAddForm(){
                document.getElementById("addForm")
                .classList.remove("hidden");

}

function hideAddForm(){
    document.getElementById("addForm").classList.add("hidden");
}
       