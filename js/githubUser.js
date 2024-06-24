import { GithubUser } from "./userChoosed.js"

// classe com a lógica dos dados 
// como os dados serão estruturados
export class Users {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()

        GithubUser.search('tiagovelosom').then(user => console.log(user))
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-users:')) || []
        console.log(this.entries)
    }

    save() {
        localStorage.setItem('@github-users:', JSON.stringify(this.entries))
    }

    async add(username) {
        try {

            const userExists = this.entries.find(entry => entry.login === username)

            console.log(userExists)

            if(userExists) {
                throw new Error('Usuário já cadastrado!')
            }

            const user = await GithubUser.search(username)
            console.log(user)
            
            if(user.login === undefined) {
                throw new Error('Usuário não encontrado!')
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        } catch(error) {
            alert(error.message)
        }

    }

    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)
        
        this.entries = filteredEntries
        this.update()
        this.save()
    }
}

// classe que vai criar a a visualização e eventos HTML

export class UsersView extends Users {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onadd()

    }

    onadd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')

            console.log(value)

            this.add(value)
        }
    }

    update() {
        this.removeAllTr()   

        this.entries.forEach(user => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
                const ifOk = confirm('Tem certeza que deseja remover esse usuário?')
                if(ifOk) {
                    this.delete(user)
                }
            }

            this.tbody.append(row)
          
        })

        this.toggleNoUsersTable()
    }

    toggleNoUsersTable() {
        const noUsersTable = this.root.querySelector('#no-users-table')
        const usersTable = this.root.querySelector('#users-table')

        if (this.entries.length === 0) {
            noUsersTable.classList.add('show')
            usersTable.classList.remove('show')
        } else {
            noUsersTable.classList.remove('show')
            usersTable.classList.add('show')
        }
    }

    
    createRow() {
        const tr = document.createElement('tr')
        
        tr.innerHTML = `
            <td class="user">
                <img src="https://github.com/tiagovelosom.png" alt="Imagem de Tiago Veloso">
                <a href="https://github.com/tiagovelosom" target="_blank">
                    <p>Tiago Veloso</p>
                    <span>/tiagovelosom</span>
                </a>
            </td>
            <td class="repositories">
                50
            </td>
            <td class="followers">
                30
            </td>
            <td>
                <button class="remove">remover</button>
            </td>
        `
        
        return tr
    }

    removeAllTr() {
    
        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
        })
    }
}