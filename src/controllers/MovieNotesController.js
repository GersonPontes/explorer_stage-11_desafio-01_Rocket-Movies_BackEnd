const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class MovieNotesController{
  async index(request, response){
    const { title } = request.query;
    const user_id = request.user.id;   

    let movieNotes;

    if(title) {
      movieNotes = await knex("movie_notes")
      .where({ user_id: user_id })
      .whereLike("title", `%${title}%`)
      .orderBy("title");
    } else {
      movieNotes = await knex("movie_notes")
      .where({ user_id: user_id });
    };

    const tags = await knex("movie_tags")
    .where({ user_id: user_id });

    const movieNotesWithTags = movieNotes.map(note => {
      const noteTags = tags.filter(tag => tag.note_id === note.id);
      return {
        ...note,
        tags: noteTags
      };   

    });   

    return response.status(200).json(movieNotesWithTags);
  };

  async show(request, response){
    const { movieNote_id } = request.params;

    const movieNote = await knex("movie_notes")
    .where({ id: movieNote_id })
    .first();

    if(!movieNote){
      throw new AppError("Filme não encontrado.");
    };

    const movieNoteTags = await knex("movie_tags")
    .where({ note_id: movieNote_id });

    return response.status(200).json({...movieNote, tags:movieNoteTags});
  };

  async create(request, response){
    const { title, description, rating, tags} = request.body;
    const user_id = request.user.id;

    const user = await knex("users")
    .where({ id: user_id })
    .first();

    if(!user){
      throw new AppError("Usuário não encontrado.");
    };

    const [ movieNotesId ] = await knex("movie_notes")
    .insert({
      title,
      description,
      rating,
      user_id: user_id
    });

    const tagsInsert = tags.map(tag => {
      return{
        name: tag,
        user_id: user_id,
        note_id: movieNotesId       
      };
    });

    await knex("movie_tags")
    .insert(tagsInsert);

    return response.status(201).json();
  };
};

module.exports = MovieNotesController;