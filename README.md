# Técnicas Laboratoriais de Reprodução Humana — Jules White

Apresentação interativa com as 27 lâminas originais, organizada em 6 módulos.

- **"O que você quer saber?"**: questionário que monta uma trilha personalizada de lâminas
- **Sumário com busca** e barra de progresso por módulo
- **Lâminas clicáveis**: cartões da jornada levam ao módulo; checklist de próximos passos
- **Quiz** de 9 perguntas com link para a lâmina de cada resposta
- **Otimizada para celular**: texto do slide abaixo da lâmina, gesto de arrastar, zoom com pinça
- **Modo apresentador**: setas, `F` tela cheia, `T` texto, `S` sumário, `Z` zoom

## Rodar localmente

```bash
node servidor-local.js
```

Abra http://localhost:4173 (no Windows, basta dar dois cliques em `Abrir apresentação.bat`).
O endereço para celular na mesma rede Wi-Fi aparece no terminal.

Por ser um site estático, também funciona no GitHub Pages sem nenhuma alteração.

## Editar conteúdo

Perguntas, trilhas, quiz e transcrições das lâminas ficam em `data.js`.
