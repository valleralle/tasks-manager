import './App.css'

export default function AppView({
  view,
  setView,
  selectionMode,
  toggleSelectionMode,
  handleSelectEntry,
  selectedIds,
  handleDeleteSelected,
  resetFilters,
  openCreateModal,
  searchName,
  setSearchName,
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  statusOptions,
  statusLabels,
  priorityOptions,
  priorityLabels,
  toggleSelectPage,
  handleSort,
  sortConfig,
  sortedFilteredEntries,
  paginatedEntries,
  editingId,
  editData,
  handleEditChange,
  startEditing,
  handleDeleteEntry,
  saveEditing,
  cancelEditing,
  pageSize,
  setPageSize,
  setCurrentPage,
  currentPage,
  pageCount,
  totalEntries,
  statusGradient,
  statusData,
  priorityGradient,
  priorityData,
  showCreateModal,
  handleCreateEntry,
  formData,
  handleFormChange,
  closeCreateModal,
  confirmDialog,
  closeConfirmDialog,
  handleConfirmDialog,
}) {
  return (
    <main className="app-shell">
      <div className="app-layout">
        <Sidebar view={view} setView={setView} />

        <section className="main-panel">
          <PageHeader />

          {view === 'table' ? (
            <TablePanel
              selectionMode={selectionMode}
              toggleSelectionMode={toggleSelectionMode}
              handleSelectEntry={handleSelectEntry}
              selectedIds={selectedIds}
              handleDeleteSelected={handleDeleteSelected}
              resetFilters={resetFilters}
              openCreateModal={openCreateModal}
              searchName={searchName}
              setSearchName={setSearchName}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterPriority={filterPriority}
              setFilterPriority={setFilterPriority}
              statusOptions={statusOptions}
              statusLabels={statusLabels}
              priorityOptions={priorityOptions}
              priorityLabels={priorityLabels}
              toggleSelectPage={toggleSelectPage}
              handleSort={handleSort}
              sortConfig={sortConfig}
              sortedFilteredEntries={sortedFilteredEntries}
              paginatedEntries={paginatedEntries}
              editingId={editingId}
              editData={editData}
              handleEditChange={handleEditChange}
              startEditing={startEditing}
              handleDeleteEntry={handleDeleteEntry}
              saveEditing={saveEditing}
              cancelEditing={cancelEditing}
              pageSize={pageSize}
              setPageSize={setPageSize}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              pageCount={pageCount}
            />
          ) : (
            <OverviewPanel
              totalEntries={totalEntries}
              statusGradient={statusGradient}
              statusData={statusData}
              priorityGradient={priorityGradient}
              priorityData={priorityData}
            />
          )}
        </section>
      </div>

      {showCreateModal && (
        <CreateModal
          formData={formData}
          handleCreateEntry={handleCreateEntry}
          handleFormChange={handleFormChange}
          statusOptions={statusOptions}
          statusLabels={statusLabels}
          priorityOptions={priorityOptions}
          priorityLabels={priorityLabels}
          closeCreateModal={closeCreateModal}
        />
      )}

      {confirmDialog.visible && (
        <ConfirmDialog
          confirmDialog={confirmDialog}
          closeConfirmDialog={closeConfirmDialog}
          handleConfirmDialog={handleConfirmDialog}
        />
      )}
    </main>
  )
}

function Sidebar({ view, setView }) {
  return (
    <aside className="sidebar" aria-label="App Navigation">
      <button
        type="button"
        className={`nav-button ${view === 'table' ? 'active' : ''}`}
        onClick={() => setView('table')}
        aria-label="Tabelle"
      >
        <span className="nav-icon">📋</span>
        <span className="visually-hidden">Tabelle</span>
      </button>
      <button
        type="button"
        className={`nav-button ${view === 'overview' ? 'active' : ''}`}
        onClick={() => setView('overview')}
        aria-label="Statusübersicht"
      >
        <span className="nav-icon">📊</span>
        <span className="visually-hidden">Statusübersicht</span>
      </button>
    </aside>
  )
}

function PageHeader() {
  return (
    <header className="page-header">
      <div>
        <h1>Tests-Manager</h1>
      </div>
    </header>
  )
}

function TablePanel({
  selectionMode,
  toggleSelectionMode,
  handleSelectEntry,
  selectedIds,
  handleDeleteSelected,
  resetFilters,
  openCreateModal,
  searchName,
  setSearchName,
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  statusOptions,
  statusLabels,
  priorityOptions,
  priorityLabels,
  toggleSelectPage,
  handleSort,
  sortConfig,
  sortedFilteredEntries,
  paginatedEntries,
  editingId,
  editData,
  handleEditChange,
  startEditing,
  handleDeleteEntry,
  saveEditing,
  cancelEditing,
  pageSize,
  setPageSize,
  setCurrentPage,
  currentPage,
  pageCount,
}) {
  return (
    <section className="panel">
      <FilterBar
        selectionMode={selectionMode}
        toggleSelectPage={toggleSelectPage}
        handleDeleteSelected={handleDeleteSelected}
        selectedIds={selectedIds}
        resetFilters={resetFilters}
        openCreateModal={openCreateModal}
        searchName={searchName}
        setSearchName={setSearchName}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
        statusOptions={statusOptions}
        statusLabels={statusLabels}
        priorityOptions={priorityOptions}
        priorityLabels={priorityLabels}
      />

      <EntryTable
        selectionMode={selectionMode}
        toggleSelectionMode={toggleSelectionMode}
        handleSelectEntry={handleSelectEntry}
        selectedIds={selectedIds}
        handleSort={handleSort}
        sortConfig={sortConfig}
        sortedFilteredEntries={sortedFilteredEntries}
        paginatedEntries={paginatedEntries}
        editingId={editingId}
        editData={editData}
        handleEditChange={handleEditChange}
        startEditing={startEditing}
        handleDeleteEntry={handleDeleteEntry}
        saveEditing={saveEditing}
        cancelEditing={cancelEditing}
        statusOptions={statusOptions}
        statusLabels={statusLabels}
        priorityOptions={priorityOptions}
        priorityLabels={priorityLabels}
      />

      <PaginationBar
        pageSize={pageSize}
        setPageSize={setPageSize}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        pageCount={pageCount}
      />
    </section>
  )
}

function FilterBar({
  selectionMode,
  toggleSelectPage,
  handleDeleteSelected,
  selectedIds,
  resetFilters,
  openCreateModal,
  searchName,
  setSearchName,
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  statusOptions,
  statusLabels,
  priorityOptions,
  priorityLabels,
}) {
  return (
    <div className="panel-bar filter-bar">
      <div className="filter-label">Filter</div>

      <label className="filter-field">
        <span>Suche</span>
        <input
          type="search"
          value={searchName}
          onChange={(event) => setSearchName(event.target.value)}
          placeholder="Name suchen"
        />
      </label>

      <label className="filter-field">
        <span>Status</span>
        <select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)}>
          <option value="all">Alle</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {statusLabels[status]}
            </option>
          ))}
        </select>
      </label>

      <label className="filter-field">
        <span>Priorität</span>
        <select value={filterPriority} onChange={(event) => setFilterPriority(event.target.value)}>
          <option value="all">Alle</option>
          {priorityOptions.map((priority) => (
            <option key={priority} value={priority}>
              {priorityLabels[priority]}
            </option>
          ))}
        </select>
      </label>

      {selectionMode && (
        <button type="button" className="button secondary" onClick={toggleSelectPage}>
          Alle auf Seite auswählen
        </button>
      )}
      {selectionMode && (
        <button type="button" className="button danger" onClick={handleDeleteSelected} disabled={selectedIds.length === 0}>
          Ausgewählte löschen
        </button>
      )}

      <button type="button" className="button secondary" onClick={resetFilters}>
        Filter zurücksetzen
      </button>
      <button type="button" className="button primary" onClick={openCreateModal}>
        Neuer Test
      </button>
    </div>
  )
}

function EntryTable({
  selectionMode,
  toggleSelectionMode,
  handleSelectEntry,
  selectedIds,
  handleSort,
  sortConfig,
  sortedFilteredEntries,
  paginatedEntries,
  editingId,
  editData,
  handleEditChange,
  startEditing,
  handleDeleteEntry,
  saveEditing,
  cancelEditing,
  statusOptions,
  statusLabels,
  priorityOptions,
  priorityLabels,
}) {
  return (
    <div className="table-wrapper">
      <table className="entry-table">
        <thead>
          <tr>
            <th>
              <button
                type="button"
                className={`header-edit-button ${selectionMode ? 'active' : ''}`}
                onClick={toggleSelectionMode}
                aria-label="Bearbeiten aktivieren"
              >
                ✏️
              </button>
            </th>
            <th>
              <SortButton label="Name" sortKey="name" sortConfig={sortConfig} onClick={handleSort} />
            </th>
            <th>
              <SortButton label="Status" sortKey="status" sortConfig={sortConfig} onClick={handleSort} />
            </th>
            <th>
              <SortButton label="Priorität" sortKey="priority" sortConfig={sortConfig} onClick={handleSort} />
            </th>
            <th>
              <SortButton label="LastModified" sortKey="lastModified" sortConfig={sortConfig} onClick={handleSort} />
            </th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {sortedFilteredEntries.length === 0 ? (
            <tr>
              <td colSpan={6} className="empty-row">
                Keine Einträge vorhanden.
              </td>
            </tr>
          ) : (
            paginatedEntries.map((entry) => (
              <EntryRow
                key={entry.id}
                entry={entry}
                selectionMode={selectionMode}
                selectedIds={selectedIds}
                handleSelectEntry={handleSelectEntry}
                editingId={editingId}
                editData={editData}
                handleEditChange={handleEditChange}
                startEditing={startEditing}
                handleDeleteEntry={handleDeleteEntry}
                saveEditing={saveEditing}
                cancelEditing={cancelEditing}
                statusOptions={statusOptions}
                statusLabels={statusLabels}
                priorityOptions={priorityOptions}
                priorityLabels={priorityLabels}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

function SortButton({ label, sortKey, sortConfig, onClick }) {
  const symbol = sortConfig.key === sortKey ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '⇅'

  return (
    <button type="button" className="sort-button" onClick={() => onClick(sortKey)}>
      {label} <span className="sort-indicator">{symbol}</span>
    </button>
  )
}

function EntryRow({
  entry,
  selectionMode,
  selectedIds,
  handleSelectEntry,
  editingId,
  editData,
  handleEditChange,
  startEditing,
  handleDeleteEntry,
  saveEditing,
  cancelEditing,
  statusOptions,
  statusLabels,
  priorityOptions,
  priorityLabels,
}) {
  return (
    <tr>
      <td>
        {selectionMode && (
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={selectedIds.includes(entry.id)}
              onChange={() => handleSelectEntry(entry.id)}
              aria-label={`Eintrag ${entry.name} auswählen`}
            />
          </label>
        )}
      </td>
      <td>
        {editingId === entry.id ? (
          <input type="text" name="name" value={editData.name} onChange={handleEditChange} />
        ) : (
          entry.name
        )}
      </td>
      <td>
        {editingId === entry.id ? (
          <select name="status" value={editData.status} onChange={handleEditChange}>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        ) : (
          <span className={`status-chip ${entry.status}`}>{statusLabels[entry.status]}</span>
        )}
      </td>
      <td>
        {editingId === entry.id ? (
          <select name="priority" value={editData.priority} onChange={handleEditChange}>
            {priorityOptions.map((priority) => (
              <option key={priority} value={priority}>
                {priorityLabels[priority]}
              </option>
            ))}
          </select>
        ) : (
          <span className={`priority-chip ${entry.priority}`}>{priorityLabels[entry.priority]}</span>
        )}
      </td>
      <td>{entry.lastModified}</td>
      <td className="action-cell">
        {editingId === entry.id ? (
          <div className="action-group">
            <button type="button" className="action-button save" onClick={() => saveEditing(entry.id)}>
              Speichern
            </button>
            <button type="button" className="action-button cancel" onClick={cancelEditing}>
              Abbrechen
            </button>
          </div>
        ) : (
          <div className="action-group">
            <button type="button" className="action-button" onClick={() => startEditing(entry)}>
              Bearbeiten
            </button>
            <button type="button" className="action-button delete" onClick={() => handleDeleteEntry(entry.id)}>
              Löschen
            </button>
          </div>
        )}
      </td>
    </tr>
  )
}

function PaginationBar({ pageSize, setPageSize, setCurrentPage, currentPage, pageCount }) {
  return (
    <div className="pagination-bar">
      <label className="pagination-field">
        Einträge pro Seite
        <select
          value={pageSize}
          onChange={(event) => {
            setPageSize(Number(event.target.value))
            setCurrentPage(1)
          }}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={0}>Alle</option>
        </select>
      </label>

      <div className="page-controls">
        <button type="button" className="button secondary" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
          Erste
        </button>
        <button
          type="button"
          className="button secondary"
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          disabled={currentPage === 1}
        >
          Zurück
        </button>
        <span className="page-info">
          Seite {currentPage} von {pageCount}
        </span>
        <button
          type="button"
          className="button secondary"
          onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
          disabled={currentPage === pageCount}
        >
          Weiter
        </button>
        <button type="button" className="button secondary" onClick={() => setCurrentPage(pageCount)} disabled={currentPage === pageCount}>
          Letzte
        </button>
      </div>
    </div>
  )
}

function OverviewPanel({ totalEntries, statusGradient, statusData, priorityGradient, priorityData }) {
  return (
    <section className="panel overview-panel">
      <div className="overview-header">
        <div>
          <h2>Statusübersicht</h2>
        </div>
        <div className="overview-total">{totalEntries} Einträge</div>
      </div>

      <div className="overview-grid">
        <div className="overview-block">
          <div className="pie-card">
            <div className="pie-chart" style={{ background: statusGradient }} />
            <span className="pie-label">Statusverteilung</span>
          </div>
          <div className="status-grid">
            {statusData.map(({ status, count, color, label }) => (
              <div key={status} className="status-card">
                <div className="status-card-title">
                  <span className="status-dot" style={{ background: color }} />
                  {label}
                </div>
                <div className="status-card-value">{count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="overview-block">
          <div className="pie-card">
            <div className="pie-chart" style={{ background: priorityGradient }} />
            <span className="pie-label">Prioritätsverteilung</span>
          </div>
          <div className="status-grid">
            {priorityData.map(({ priority, count, color, label }) => (
              <div key={priority} className="status-card">
                <div className="status-card-title">
                  <span className="status-dot" style={{ background: color }} />
                  {label}
                </div>
                <div className="status-card-value">{count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function CreateModal({ formData, handleCreateEntry, handleFormChange, statusOptions, statusLabels, priorityOptions, priorityLabels, closeCreateModal }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <h2>Neuen Eintrag erstellen</h2>
        <form className="modal-form" onSubmit={handleCreateEntry}>
          <label>
            Name
            <input type="text" name="name" value={formData.name} onChange={handleFormChange} autoFocus />
          </label>

          <label>
            Status
            <select name="status" value={formData.status} onChange={handleFormChange}>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>
          </label>

          <label>
            Priorität
            <select name="priority" value={formData.priority} onChange={handleFormChange}>
              {priorityOptions.map((priority) => (
                <option key={priority} value={priority}>
                  {priorityLabels[priority]}
                </option>
              ))}
            </select>
          </label>

          <div className="modal-actions">
            <button type="button" className="action-button cancel" onClick={closeCreateModal}>
              Abbrechen
            </button>
            <button type="submit" className="button save">
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ConfirmDialog({ confirmDialog, closeConfirmDialog, handleConfirmDialog }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <h2>Bestätigung</h2>
        <div className="modal-form">
          <p>{confirmDialog.message}</p>
          <div className="modal-actions">
            <button type="button" className="action-button cancel" onClick={closeConfirmDialog}>
              Abbrechen
            </button>
            <button type="button" className="button danger" onClick={handleConfirmDialog}>
              Löschen
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
