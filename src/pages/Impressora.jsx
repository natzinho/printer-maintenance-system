import { useEffect, useState } from "react";
import { getImpressoras, deletarImpressora } from "../services/api";

const LOGO_URL =
  "https://chartmenus.avatim.com.br/Content/img/logohorizontal-verde.svg";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #f0ebe0; font-family: 'Source Sans 3', sans-serif; color: #2c2c2c; font-size: 15px; }

  /* ── Navbar ── */
  .navbar {
    background: #fff; border-bottom: 1px solid #ddd;
    padding: 0 32px; display: flex; align-items: center;
    height: 64px; gap: 8px;
  }
  .navbar-logo img { height: 42px; display: block; margin-right: 16px; }
  .nav-menus { display: flex; gap: 2px; }
  .nav-menu-btn {
    background: transparent; border: none; padding: 8px 16px;
    font-size: 15px; color: #3a3a3a; cursor: pointer;
    font-family: inherit; border-radius: 4px;
    display: flex; align-items: center; gap: 4px; transition: background 0.15s;
  }
  .nav-menu-btn:hover { background: #f0ebe0; }
  .nav-menu-btn.active { background: #e8f0e8; color: #1a4a1a; font-weight: 700; }
  .nav-right { margin-left: auto; }
  .nav-right button {
    background: transparent; border: 1px solid #ccc;
    padding: 6px 16px; border-radius: 4px; cursor: pointer;
    font-family: inherit; font-size: 14px; color: #444; transition: background 0.15s;
  }
  .nav-right button:hover { background: #f0ebe0; }

  /* ── Container ── */
  .container { max-width: 1300px; margin: 0 auto; padding: 32px 32px; }

  /* ── Breadcrumb ── */
  .breadcrumb { font-size: 13px; color: #999; margin-bottom: 18px; }
  .breadcrumb span { color: #2d6a2d; font-weight: 600; }

  /* ── Page header ── */
  .page-header {
    display: flex; align-items: center;
    justify-content: space-between; margin-bottom: 20px;
    padding-bottom: 16px; border-bottom: 2px solid #d0c8b8;
  }
  .page-title { font-size: 24px; font-weight: 700; color: #1a1a1a; display: flex; align-items: center; gap: 10px; }
  .btn-add {
    background: #2d7a2d; color: #fff; border: none;
    padding: 10px 24px; border-radius: 5px; font-size: 15px;
    cursor: pointer; font-family: inherit; font-weight: 600;
    display: flex; align-items: center; gap: 6px;
    transition: background 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  }
  .btn-add:hover { background: #1e5e1e; }

  /* ── Card ── */
  .card {
    background: #fff; border: 1px solid #d8d0c0;
    border-radius: 6px; margin-bottom: 16px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }
  .card-body { padding: 18px 24px; }

  /* ── Filter bar ── */
  .filter-row { display: flex; align-items: flex-end; gap: 16px; flex-wrap: wrap; }
  .form-group  { display: flex; flex-direction: column; gap: 5px; }
  .form-label  { font-size: 14px; font-weight: 600; color: #555; }
  .form-select {
    border: 1px solid #c8bfb0; border-radius: 4px;
    padding: 9px 36px 9px 12px; font-size: 15px;
    background: #fff; color: #3a3a3a; font-family: inherit; min-width: 240px;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 12px center; cursor: pointer;
  }
  .form-select:focus { outline: none; border-color: #2d7a2d; }
  .btn-pesquisar {
    background: #1a4a1a; color: #fff; border: none;
    padding: 10px 24px; border-radius: 4px; font-size: 15px;
    cursor: pointer; font-family: inherit; font-weight: 600;
    display: flex; align-items: center; gap: 6px; transition: background 0.15s;
  }
  .btn-pesquisar:hover { background: #0f2e0f; }

  /* ── Table toolbar ── */
  .table-toolbar {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 0 12px; font-size: 14px; color: #777; flex-wrap: wrap; gap: 8px;
  }
  .per-page { display: flex; align-items: center; gap: 8px; }
  .per-page select {
    border: 1px solid #c8bfb0; border-radius: 4px; padding: 5px 8px;
    font-size: 14px; font-family: inherit; background: #fff;
  }
  .search-box { display: flex; align-items: center; gap: 8px; }
  .search-box input {
    border: 1px solid #c8bfb0; border-radius: 4px;
    padding: 7px 12px; font-size: 14px; font-family: inherit;
    background: #fff; width: 220px;
  }
  .search-box input:focus { outline: none; border-color: #2d7a2d; }

  /* ── Table ── */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 15px; }
  thead tr { background: #f5f0e8; border-bottom: 2px solid #c8bfb0; }
  th {
    padding: 12px 16px; text-align: left;
    font-size: 14px; font-weight: 700; color: #3a3a3a;
    white-space: nowrap; cursor: pointer; user-select: none;
  }
  th:hover { color: #1a4a1a; }
  td { padding: 12px 16px; border-bottom: 1px solid #ede8dc; color: #2c2c2c; }
  tbody tr:last-child td { border-bottom: none; }
  tbody tr:hover td { background: #faf7f0; }
  tbody tr { animation: fadeIn 0.2s ease both; }
  @keyframes fadeIn { from { opacity:0; transform:translateY(3px); } to { opacity:1; transform:translateY(0); } }

  .cell-num { color: #aaa; font-size: 13px; width: 40px; }
  .cell-pat { font-weight: 700; color: #1a4a1a; }

  /* Badges */
  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 4px 12px; border-radius: 4px; font-size: 13px; font-weight: 600;
  }
  .badge-laser     { background: #d4edda; color: #155724; }
  .badge-jato      { background: #d1ecf1; color: #0c5460; }
  .badge-matricial { background: #fff3cd; color: #856404; }
  .badge-outro     { background: #e2e3e5; color: #383d41; }

  /* Botões de ação */
  .acoes { display: flex; gap: 6px; }
  .btn-editar {
    background: #e8f4e8; border: 1px solid #a8d5a8; color: #1a5a1a;
    border-radius: 4px; padding: 6px 14px; font-size: 13px;
    cursor: pointer; font-family: inherit; font-weight: 600;
    transition: all 0.15s; display: flex; align-items: center; gap: 4px;
  }
  .btn-editar:hover { background: #c8e8c8; border-color: #2d7a2d; }
  .btn-excluir {
    background: #fde8e8; border: 1px solid #f5a8a8; color: #8b1a1a;
    border-radius: 4px; padding: 6px 14px; font-size: 13px;
    cursor: pointer; font-family: inherit; font-weight: 600;
    transition: all 0.15s; display: flex; align-items: center; gap: 4px;
  }
  .btn-excluir:hover { background: #fbc8c8; border-color: #c0392b; color: #c0392b; }

  /* ── Table footer ── */
  .table-footer {
    display: flex; justify-content: space-between; align-items: center;
    padding: 12px 0 0; font-size: 13px; color: #888; flex-wrap: wrap; gap: 8px;
  }

  .empty-row td { text-align: center; padding: 48px; color: #aaa; font-size: 15px; }

  /* ── Modal ── */
  .overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.45);
    display: flex; align-items: center; justify-content: center; z-index: 200;
  }
  .modal {
    background: #fff; border-radius: 8px; padding: 32px 36px;
    max-width: 400px; width: 90%; text-align: center;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  }
  .modal-icon { font-size: 40px; margin-bottom: 12px; }
  .modal h3   { font-size: 20px; font-weight: 700; margin-bottom: 8px; color: #1a1a1a; }
  .modal p    { color: #888; font-size: 15px; margin-bottom: 28px; line-height: 1.6; }
  .modal-btns { display: flex; gap: 12px; justify-content: center; }
  .btn-cancel2 {
    background: #f0ebe0; border: 1px solid #c8bfb0; color: #444;
    padding: 10px 24px; border-radius: 5px; cursor: pointer;
    font-family: inherit; font-size: 15px;
  }
  .btn-cancel2:hover { background: #e0dbd0; }
  .btn-ok2 {
    background: #c0392b; border: none; color: #fff;
    padding: 10px 24px; border-radius: 5px; cursor: pointer;
    font-family: inherit; font-size: 15px; font-weight: 700;
  }
  .btn-ok2:hover { background: #a93226; }
`;

const TIPO_BADGE = {
  Laser: <span className="badge badge-laser">🖨️ Laser</span>,
  "Jato de Tinta": <span className="badge badge-jato">🖌️ Jato de Tinta</span>,
  Matricial: <span className="badge badge-matricial">📠 Matricial</span>,
};

export default function Impressora() {
  const [impressoras, setImpressoras] = useState([]);
  const [filtradas, setFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    carregar();
  }, []);

  useEffect(() => {
    let lista = impressoras;
    if (filtroTipo) lista = lista.filter((i) => i.tipo === filtroTipo);
    if (busca)
      lista = lista.filter(
        (i) =>
          i.modelo?.toLowerCase().includes(busca.toLowerCase()) ||
          i.placaPatrimonio?.toLowerCase().includes(busca.toLowerCase()) ||
          i.nomeSetor?.toLowerCase().includes(busca.toLowerCase()),
      );
    setFiltradas(lista);
  }, [impressoras, filtroTipo, busca]);

  async function carregar() {
    setLoading(true);
    try {
      const data = await getImpressoras();
      setImpressoras(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function confirmarExclusao() {
    try {
      await deletarImpressora(confirmId);
      setConfirmId(null);
      carregar();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <style>{styles}</style>

      <nav className="navbar">
        <div className="navbar-logo">
          <img src={LOGO_URL} alt="Avatim" />
        </div>
        <div className="nav-menus">
          {[
            "Comercial",
            "Faturamento",
            "Financeiro",
            "Operacional",
            "TI",
            "RH",
          ].map((m) => (
            <button
              key={m}
              className={`nav-menu-btn ${m === "TI" ? "active" : ""}`}
            >
              {m} {m !== "TI" && "▾"}
            </button>
          ))}
        </div>
        <div className="nav-right">
          <button>👤 Perfil ▾</button>
        </div>
      </nav>

      <div className="container">
        <div className="breadcrumb">
          Início › TI › <span>Controle de Impressoras</span>
        </div>

        <div className="page-header">
          <div className="page-title">🖨️ Controle de Impressoras</div>
          <button className="btn-add">＋ Adicionar</button>
        </div>

        {/* Filtros */}
        <div className="card">
          <div className="card-body">
            <div className="filter-row">
              <div className="form-group">
                <label className="form-label">Tipo:</label>
                <select
                  className="form-select"
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                >
                  <option value="">Selecione um Tipo</option>
                  <option value="Laser">Laser</option>
                  <option value="Jato de Tinta">Jato de Tinta</option>
                  <option value="Matricial">Matricial</option>
                </select>
              </div>
              <button className="btn-pesquisar">🔍 Pesquisar</button>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="card">
          <div className="card-body">
            <div className="table-toolbar">
              <div className="per-page">
                Exibir&nbsp;
                <select>
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
                &nbsp;resultados por página
              </div>
              <div className="search-box">
                Pesquisar:&nbsp;
                <input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th className="cell-num">#</th>
                    <th>Patrimônio ↕</th>
                    <th>Modelo ↕</th>
                    <th>Tipo ↕</th>
                    <th>Setor ↕</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr className="empty-row">
                      <td colSpan="6">Carregando...</td>
                    </tr>
                  ) : filtradas.length === 0 ? (
                    <tr className="empty-row">
                      <td colSpan="6">Nenhum registro encontrado.</td>
                    </tr>
                  ) : (
                    filtradas.map((imp, i) => (
                      <tr
                        key={imp.id}
                        style={{ animationDelay: `${i * 35}ms` }}
                      >
                        <td className="cell-num">{imp.id}</td>
                        <td className="cell-pat">{imp.placaPatrimonio}</td>
                        <td>{imp.modelo}</td>
                        <td>
                          {TIPO_BADGE[imp.tipo] || (
                            <span className="badge badge-outro">
                              ❓ {imp.tipo}
                            </span>
                          )}
                        </td>
                        <td>{imp.nomeSetor}</td>
                        <td>
                          <div className="acoes">
                            <button className="btn-editar">✏️ Editar</button>
                            <button
                              className="btn-excluir"
                              onClick={() => setConfirmId(imp.id)}
                            >
                              🗑 Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              <span>
                Exibindo {filtradas.length} de {impressoras.length} registros
              </span>
              <span>Banco: Avatim · TB_Impressoras</span>
            </div>
          </div>
        </div>
      </div>

      {confirmId && (
        <div className="overlay" onClick={() => setConfirmId(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <h3>Confirmar exclusão</h3>
            <p>
              Deseja remover esta impressora permanentemente?
              <br />
              Esta ação não pode ser desfeita.
            </p>
            <div className="modal-btns">
              <button
                className="btn-cancel2"
                onClick={() => setConfirmId(null)}
              >
                Cancelar
              </button>
              <button className="btn-ok2" onClick={confirmarExclusao}>
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
