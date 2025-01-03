import ConnectDB from "@/lib/config/db"
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server"
import BlogModel from "@/lib/models/BlogModel";
const fs = require('fs');

const LoadDB = async()=> {
    await ConnectDB();
}
LoadDB();

//API End point to get all blogs
export async function GET(request){

const blogId = request.nextUrl.searchParams.get("id")
if(blogId) {
    const blog = await BlogModel.findById(blogId)
    return NextResponse.json(blog)
}
else{
    const blogs = await BlogModel.find({})
    return NextResponse.json({blogs})
}


}


// API Endpoint for Uploading Blogs
export async function POST(request){

    const formData = await request.formData();
    const timestamp = Date.now();

    const  image = formData.get('image');
    const imageByteData = await image.arrayBuffer();
    const buffer = Buffer.from(imageByteData);
    const path = `./public/${timestamp}_${image.name}`;
    await writeFile(path,buffer)
    const imgUrl = `/${timestamp}_${image.name}`;
    // console.log(imgUrl)

    const blogData = {
        title:`${formData.get('title')}`,
        description: `${formData.get('description')}`,
        category:`${formData.get('category')}`,
        author:`${formData.get('author')}`,
        image:`${imgUrl}`,
        authorImg:`${formData.get('authorImg')}`
    }

    await BlogModel.create(blogData);
    console.log('Blog Saved');

    return NextResponse.json({success:true,msg:'Blog Added'})

}

// Creating API Endpoint to delete Blog
export async function DELETE(request){
    const id = await request.nextUrl.searchParams.get("id")
    // console.log(id)
    const blog = await BlogModel.findById(id)

    // ตรวจสอบว่า blog มีอยู่หรือไม่
    if (!blog) {
        return NextResponse.json({ success: false, msg: "Blog not found" }, { status: 404 });
    }

    // ถ้า blog มีอยู่ ให้ดำเนินการลบภาพ
    fs.unlink(`./public${blog.image}`,()=>{});
    await BlogModel.findByIdAndDelete(id)
    return NextResponse.json({msg:"Blog Deleted"})
}
