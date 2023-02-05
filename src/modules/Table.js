import { GithubUser } from "./GithubUser.js";
import { Storage } from "./Storage.js";

export class Table {
  constructor(table, form, storage) {
    this.storage = storage;
    this.table = document.querySelector(table);
    this.form = document.querySelector(form);

    this.load();
  }

  load() {
    this.data = Storage.get(this.storage);
    this.render();
    this.submit();
  }

  submit() {
    this.form.onsubmit = async (event) => {
      event.preventDefault();
      const input = this.form.querySelector("input");
      const username = input.value;
      input.value = "";
      try {
        const userExistis = this.data.find((user) => user.login == username);

        if (userExistis) {
          throw new Error("Usuário já cadastrado");
        }

        const user = await GithubUser.search(username);

        if (user.login === undefined) {
          throw new Error("Usuário não encontrado!");
        }

        this.data = [user, ...this.data];
        this.render();
        this.save();
      } catch (error) {
        alert(error.message);
      }
    };
  }

  render() {
    this.clear();

    this.data.forEach((user) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
      <td>
        <img
          src="${user.avatar_url}"
          alt="${user.name}"
        />
        <a href="${user.url}">
          <strong>${user.name}</strong>
          /${user.login}
        </a>
      </td>
      <td>${user.public_repos}</td>
      <td>${user.followers}</td>
      <td><button class="remove">Remover</button></td>
      `;

      tr.querySelector(".remove").onclick = () => {
        this.remove(user);
      };

      this.table.querySelector("tbody").append(tr);
    });
  }

  save() {
    Storage.save(this.storage, this.data);
  }

  remove(user) {
    const filteredData = this.data.filter(
      (entry) => entry.login !== user.login
    );

    this.data = filteredData;
    this.render();
    this.save();
  }

  clear() {
    this.table.querySelectorAll("tbody tr").forEach((tr) => {
      tr.remove();
    });
  }
}
