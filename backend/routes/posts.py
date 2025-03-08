from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
import models, schemas, database, auth
from typing import Optional, List
import os
import shutil

router = APIRouter()

UPLOAD_FOLDER = "images"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

db_dependency = Depends(database.get_db)
current_user_dependency = Depends(auth.get_current_user)


@router.post("/posts", response_model=schemas.PostResponse)
def create_post(
    title: str = Form(...),
    content: str = Form(...),
    file: Optional[UploadFile] = File(None),
    db: Session = db_dependency,
    current_user: models.User = current_user_dependency
):
    image_url = None

    if file:
        file_path = f"{UPLOAD_FOLDER}/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        image_url = f"/{file_path}"

    new_post = models.Post(
        title=title,
        content=content,
        author_id=current_user.id,
        image_url=image_url
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    return new_post


@router.get("/posts", response_model=List[schemas.PostResponse])
def list_posts(
    db: Session = db_dependency, 
    search: Optional[str] = None, 
    skip: int = 0, 
    limit: int = 10
):
    query = db.query(models.Post)
    if search:
        query = query.filter(
            or_(
                models.Post.title.ilike(f"%{search}%"),
                models.Post.content.ilike(f"%{search}%")
            )
        )
    posts = query.order_by(models.Post.updated_at.desc()).offset(skip).limit(limit).all()
    return posts


@router.get("/posts/{post_id}", response_model=schemas.PostResponse)
def get_post(post_id: int, db: Session = db_dependency):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.put("/posts/{post_id}", response_model=schemas.PostResponse)
def update_post(
    post_id: int,
    title: Optional[str] = Form(None),
    content: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = db_dependency,
    current_user: models.User = current_user_dependency
):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only update your own posts")

    if title:
        post.title = title
    if content:
        post.content = content
    if file:
        file_path = f"{UPLOAD_FOLDER}/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        post.image_url = f"/{file_path}"

    db.commit()
    db.refresh(post)
    return post


@router.delete("/posts/{post_id}")
def delete_post(post_id: int, db: Session = db_dependency, current_user: models.User = current_user_dependency):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only delete your own posts")

    db.delete(post)
    db.commit()
    return {"message": "Post deleted successfully"}
