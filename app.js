const express=require("express");
const app=express();
const mongoose=require("mongoose");
const listing=require("./models/listing.js");
const path=require("path");
const methodOverride = require('method-override');
const ejsMate=require("ejs-mate");


// app.use(express.static(path.join(__dirname,"public")));
app.set("views engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));



app.listen(8080,()=>{
console.log("app is listening")}
);

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });



//index route
app.get("/listings",async(req,res)=>{
    const alllistings =await listing.find({});
    res.render("./listings/index.ejs",{alllistings});
})

//new listings
//NOTE- if we write new below show route it will search whatever written after /listings as id
app.get("/listings/new",(req,res)=>{
    res.render("./listings/newlistings.ejs");
});

//create route
app.post("/listings",async(req,res)=>{
    const newlisting=new listing(req.body.listing);
   await newlisting.save();
    console.log(newlisting);
    res.redirect("/listings")
})

//update route ->1:edit , 2:update
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const showlisting =await listing.findById(id);
    console.log(showlisting);
    res.render("./listings/edit.ejs",{showlisting})
})

app.put("/listings/:id",async(req,res)=>{
    let{id}=req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings")
})


app.delete("/listings/:id",async(req,res)=>{
    let{id}=req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings")
    })



//show route
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const showlisting =await listing.findById(id);
    res.render("./listings/show.ejs",{showlisting});
    
})
