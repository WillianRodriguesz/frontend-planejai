# Configuração da API

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
API_URL=http://localhost:3000
CARTEIRA_ID_TEMP=seu-id-de-carteira-aqui
```

> **Nota:** `CARTEIRA_ID_TEMP` é temporário. Futuramente o ID da carteira virá de um cookie após autenticação.

## Estrutura Criada

### 1. **CarteiraContext** (`src/contexts/CarteiraContext.tsx`)

- Gerencia o ID da carteira globalmente
- **Atualmente:** Lê o ID da variável de ambiente `CARTEIRA_ID_TEMP`
- **Futuramente:** Lerá o ID de um cookie após autenticação
- Fornece o hook `useCarteira()` para acessar o ID em qualquer componente

### 2. **useSaldo Hook** (`src/hooks/useSaldo.ts`)

- Hook personalizado para buscar saldo mensal
- Parâmetros: `{ mes: number, ano: number }`
- Retorna: `{ saldo, loading, error, refetch }`
- Busca automaticamente quando mes/ano mudam

### 3. **Tipos** (`src/types/saldo.ts`)

```typescript
interface SaldoMensalDto {
  mes: number;
  ano: number;
  saldoMes: number;
  entradas: number;
  saidas: number;
}
```

## Como Usar

### Configuração Atual (Temporária)

Por enquanto, o ID da carteira vem da variável de ambiente:

1. Configure o `.env`:

```env
CARTEIRA_ID_TEMP=seu-id-de-carteira-real
```

2. O `CarteiraContext` automaticamente carrega esse ID e disponibiliza para todos os componentes.

### Futuro (Com Cookie)

Quando implementar autenticação real:

```typescript
import { useCarteira } from "../../contexts/CarteiraContext";

const { setIdCarteira } = useCarteira();

// Após autenticação, salvar no cookie e no contexto
document.cookie = `carteiraId=${idRetornadoDaAPI}; path=/; secure; samesite=strict`;
setIdCarteira(idRetornadoDaAPI);
```

### No Home (ou qualquer componente)

```typescript
import { useSaldo } from "../../hooks/useSaldo";

const { saldo, loading, error } = useSaldo({
  mes: 10,
  ano: 2025,
});

// saldo contém: { mes, ano, saldoMes, entradas, saidas }
```

## Endpoint da API

```
GET /saldo/:idCarteira?data=YYYY-MM
```

**Resposta:**

```json
{
  "mes": 10,
  "ano": 2025,
  "saldoMes": 100.25,
  "entradas": 220.75,
  "saidas": 120.5
}
```

## Próximos Passos

1. ✅ ID da carteira vem da env temporariamente
2. Implementar autenticação real que retorne o ID da carteira
3. Salvar ID da carteira em cookie HTTP-only após login
4. Ler ID do cookie ao inicializar o `CarteiraContext`
5. Implementar refresh automático do saldo quando um lançamento for adicionado
6. Adicionar tratamento de erros mais robusto (ex: token expirado, sem conexão, etc.)
