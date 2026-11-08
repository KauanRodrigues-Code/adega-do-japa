# Cardápio, carrinho e pedidos — Adega do Japa

## Como alterar produtos e preços
Tudo fica em `lib/menu.ts` (preço em **centavos**: `1000` = R$ 10,00). Edite, publique o site de novo e pronto.
O preço que o cliente vê é só exibição: o servidor (`app/api/order/route.ts` + `lib/order.ts`) recalcula tudo a partir deste mesmo arquivo.
Não existe painel nem endpoint público que altere preços. Para tirar um item do ar sem apagá-lo, use `available: false`.
A taxa de entrega (R$ 10,00) e os limites (24 por item, 100 unidades) ficam em `lib/orderConfig.ts`.

## Fotos dos produtos
Salve a foto em `public/images/produtos/<id>.jpg` (quadrada, ~1000×1000 px) e preencha `image: "/images/produtos/<id>.jpg"` no item.
Sem `image`, o card mostra o selo da Adega com "Foto em breve". Hoje só a **Coca-Cola Lata Normal** tem foto.

Nomes de arquivo esperados: heineken-long-neck, heineken-lata, sol-long-neck, brahma-lata, skol-lata, antarctica-lata, original-lata,
smirnoff-ice, monster-lata, fanta-laranja-lata, guarana-lata, coca-2l, coca-1l, fanta-2l, coca-lata-normal (já existe), coca-lata-zero,
agua-com-gas, agua-sem-gas.

Modelo de pedido para gerar cada imagem no mesmo padrão da Coca-Cola (troque o produto):
"Fotografia publicitária realista de [PRODUTO REAL, com a embalagem correta] centralizado, gotas de condensação e gelo, fundo preto sofisticado
com o logotipo da Adega do Japa iluminado em dourado e laranja ao fundo, balcão molhado refletindo luz âmbar, enquadramento quadrado."
Confira sempre se rótulo e embalagem estão corretos antes de publicar.

## Como funciona a segurança do pedido
- O navegador envia só `id` + `qty` + dados do cliente. Nunca preço, subtotal, taxa ou total.
- O servidor valida tudo (ids, inteiros de 1 a 24, modalidade, pagamento, 18+, nome, telefone, endereço), recalcula e devolve a mensagem do WhatsApp.
- Campos de dinheiro enviados pelo cliente são ignorados. Corpo máx. 8 KB, só `application/json`, checagem de Origin, limite de 12 pedidos/min por IP.
- Texto livre do cliente é limpo (sem quebras de linha nem `* _ ~` ` `) para não forjar linhas como "TOTAL" na mensagem.
- Carrinho no `localStorage` guarda só id e quantidade (conveniência, não segurança).

**Limitações (honestas):**
1. O cliente pode editar a mensagem no WhatsApp antes de enviar. A equipe precisa conferir os valores antes de confirmar.
2. WhatsApp não confirma pagamento.
3. O limitador de requisições é em memória: em hospedagem serverless cada instância tem a sua. Para proteção forte, ative também o firewall/rate limit da plataforma.
4. A confirmação de 18+ é uma declaração, não verificação oficial de idade.

## Testes
`pnpm test:security` chama a rota real com payloads adulterados (preço, total, taxa, id inexistente, quantidades inválidas, prototype pollution etc.).
`pnpm lint` roda o typecheck. `pnpm build` compila o site.
