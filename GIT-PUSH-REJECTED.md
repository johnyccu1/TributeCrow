# Ghid Git: Ce faci când primești eroarea `[rejected] (fetch first)`

---

## 1. De ce apare eroarea?

Mesajul arată de obicei așa:
```text
! [rejected]        master -> master (fetch first)
error: failed to push some refs to 'https://github.com/...'
```

### Cauza pe scurt:
* Ai modificat ceva direct pe site-ul **GitHub** (de exemplu, ai editat sau creat fișierul [README.md](README.md)).
* În același timp, ai lucrat pe **calculator** și ai făcut un commit local (`git commit`).
* GitHub observă că pe server există modificări noi pe care calculatorul tău nu le are încă, așa că refuză `git push` pentru a nu șterge sau suprascrie munca de pe server.

---

## 2. Soluția rapidă (2 comenzi)

Când primești această eroare, deschide terminalul în folderul proiectului și rulează:

### Pasul 1: Sincronizează istoricul
```bash
git pull --rebase origin master
```
* **Ce face:** Descarcă ce s-a schimbat pe GitHub (ex. [README.md](README.md)) și așază commit-urile tale locale frumos deasupra lor, fără să creeze noduri complicate de merge.

### Pasul 2: Trimite modificările
```bash
git push origin master
```
*(sau simplu `git push`)*

* **Ce face:** Trimite acum commit-urile tale pe GitHub fără eroare.

---

## 3. Regula de aur pentru viitor

1. **Dacă editezi ceva pe GitHub direct din browser**, când te întorci la calculator dă mai întâi:
   ```bash
   git pull
   ```
2. Lucrează liniștit, fă commit-uri pe PC, iar la final dă `git push`.
