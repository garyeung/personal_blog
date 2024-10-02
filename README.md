# Personal Blog

## Description
(https://roadmap.sh/projects/personal-blog)  
This is a personal blog where you can write and publish articles. The blog will have two sections: a guest section and an admin section.

**Guest Section** — A list of pages that can be accessed by anyone:

- Home Page: This page will display the list of articles published on the blog.
- Article Page: This page will display the content of the article along with the date of publication.

**Admin Section** — are the pages that only you can access to publish, edit, or delete articles.

- Dashboard: This page will display the list of articles published on the blog along with the option to add a new article, edit an existing article, or delete an article.
- Add Article Page: This page will contain a form to add a new article. The form will have fields like title, content, and date of publication.
- Edit Article Page: This page will contain a form to edit an existing article. The form will have fields like title, content, and date of publication.

## Rerequisites
```sh
npm install npm@latest -g
```
## Installation 
```sh
git clone https://github.com/garyeung/personal_blog.git

cd personal_blog 

npm install 

```

## Usage
```sh
npm run dev
```
you can build by yourself, of course

## Projet Structure
```
/personal_blog
  /article
  /src
   /controllers
   /middleware
   /views
  router.ts
  index.ts
```

## Mechanism
The project uses the MVC design pattern.
- Model: manipulate article files including add, edit, delete, fetch

- View: the page templates

- Controller: connects the view and model by using router

- Router: a class with methods like 
   - addRouter which takes path, middlware and handler (which written in controller) as arguments
   - handleRequest which handles the client-side request and server-side response

- Middlware: a basic HTTP authentication