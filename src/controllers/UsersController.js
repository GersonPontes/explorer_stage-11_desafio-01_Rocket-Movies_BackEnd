const { hash, compare } = require('bcryptjs');
const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class UsersController {
  async show(request, response){
    const user_id = request.user.id;

    const user = await knex("users")
    .where({ id: user_id })
    .first();

    if(!user){
      throw new AppError("Usuário não encontrado.");
    };

    return response.status(200).json(user);
  };

  async create(request, response){
    const { name, email, password } = request.body;

    if(!name){
      throw new AppError("Nome é obrigatório");
    };

    if(!email){
      throw new AppError("E-mail é obrigatório");
    };

    if(!password){
      throw new AppError("Senha é obrigatório");
    };

    const checkUserExists = await knex("users").where({ email }).first();
  
    if(checkUserExists){
      throw new AppError("Este e-mail já está em uso.");
    };

    const hashedPassword = await hash(password, 8);

    await knex("users").insert({
      name: name,
      email: email,
      password: hashedPassword
    });

    return response.status(201).json();
  };

  async update(request, response){
    const { name, email, old_password, new_password} = request.body;
    const user_id = request.user.id;

    const user = await knex("users")
    .where({ id: user_id })
    .first();

    if(!user){
      throw new AppError("Usuário não encontrado.");
    };

    const userWithUpdatedEmail = await knex("users")
    .where({ email: email })
    .first();

    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
      throw new AppError("Este e-mail já está em uso.");
    };

    if(new_password && !old_password){
      throw new AppError("Você precisa informar a senha antiga para definir a nova senha.")
    };

    if(new_password && old_password){
      const checkOldPassword = await compare(old_password, user.password);

      if(!checkOldPassword){
        throw new AppError("A senha antiga não confere.");
      };
     
      user.password = await hash(new_password, 8);
    };

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    await knex("users")
    .where({ email })
    .update({
      name: user.name,
      email: user.email,
      password: user.password,
      updated_at: knex.fn.now()
    });

    return response.status(200).json();
  };
};

module.exports = UsersController;