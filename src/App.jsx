import { useEffect, useMemo, useState } from 'react'
import './App.css'
import AppView from './AppView'

const STORAGE_KEY = 'tests-manager-entries'
const statusOptions = ['waiting', 'passed', 'failed', 'skipped']
const statusLabels = {
  waiting: 'Waiting',
  passed: 'Passed',
  failed: 'Failed',
  skipped: 'Skipped',
}
const statusColors = {
  waiting: '#f59e0b',
  passed: '#10b981',
  failed: '#ef4444',
  skipped: '#6b7280',
}
const priorityColors = {
  low: '#16a34a',
  medium: '#f59e0b',
  high: '#ef4444',
}
const priorityOptions = ['low', 'medium', 'high']
const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

const sortOrder = {
  status: {
    waiting: 0,
    passed: 1,
    failed: 2,
    skipped: 3,
  },
  priority: {
    low: 0,
    medium: 1,
    high: 2,
  },
}

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${day}.${month}.${year} ${hours}:${minutes}`
}

function generateDummyEntries(count) {
  return Array.from({ length: count }, (_, index) => {
    const id = index + 1
    const status = statusOptions[index % statusOptions.length]
    const priority = priorityOptions[index % priorityOptions.length]
    const lastModified = formatDate(new Date(Date.now() - index * 60 * 60 * 1000))

    return {
      id,
      name: `Dummy Test ${id}`,
      status,
      priority,
      lastModified,
    }
  })
}

const defaultEntries = generateDummyEntries(300)

function loadStoredEntries() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return defaultEntries
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed) || parsed.length === 0) {
      window.localStorage.removeItem(STORAGE_KEY)
      return defaultEntries
    }
    return parsed
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
    return defaultEntries
  }
}

function App() {
  // Aktuelle Ansicht: Tabelle oder Übersicht
  const [view, setView] = useState('table')
  // Die Einträge, die in der App angezeigt und gespeichert werden
  const [entries, setEntries] = useState(() => loadStoredEntries())
  // Nächste ID für neue Einträge
  const [nextId, setNextId] = useState(() => {
    const maxId = loadStoredEntries().reduce((max, entry) => Math.max(max, entry.id), 0)
    return maxId + 1
  })
  // Formularzustand für das Erstellen eines neuen Eintrags
  const [formData, setFormData] = useState({
    name: '',
    status: 'waiting',
    priority: 'medium',
  })
  // Erstellungspopup anzeigen
  const [showCreateModal, setShowCreateModal] = useState(false)
  // Zustand für das eigene Bestätigungsdialog-Popup
  const [confirmDialog, setConfirmDialog] = useState({
    visible: false,
    message: '',
    onConfirm: null,
  })
  // ID des aktuell bearbeiteten Eintrags
  const [editingId, setEditingId] = useState(null)
  // Formularzustand für das Bearbeiten eines Eintrags
  const [editData, setEditData] = useState({
    name: '',
    status: 'waiting',
    priority: 'medium',
  })
  // Filter- und Suchzustände
  const [searchName, setSearchName] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])

  // Setzt alle Filter und die Seitennavigation zurück.
  // Dies wird beim Klick auf "Filter zurücksetzen" verwendet.
  const resetFilters = () => {
    setSearchName('')
    setFilterStatus('all')
    setFilterPriority('all')
    setCurrentPage(1)
    setSelectedIds([])
  }

  // Schaltet den Auswahlmodus um.
  // Im Auswahlmodus lassen sich mehrere Einträge markieren und löschen.
  const toggleSelectionMode = () => {
    setSelectionMode((current) => {
      if (current) {
        setSelectedIds([])
      }
      return !current
    })
  }

  // Markiert oder entmarkiert einen Eintrag in der Auswahl.
  const handleSelectEntry = (id) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id],
    )
  }

  // Öffnet den App-internen Bestätigungsdialog mit einer Nachricht und Callback.
  // Der Callback wird später beim Bestätigen ausgeführt.
  const openConfirmDialog = (message, onConfirm) => {
    setConfirmDialog({ visible: true, message, onConfirm })
  }

  // Schließt den Bestätigungsdialog ohne weitere Aktion.
  const closeConfirmDialog = () => {
    setConfirmDialog({ visible: false, message: '', onConfirm: null })
  }

  // Führt die gespeicherte Bestätigungsaktion aus und schließt das Popup.
  const handleConfirmDialog = () => {
    if (confirmDialog.onConfirm) confirmDialog.onConfirm()
    closeConfirmDialog()
  }

  // Öffnet die Bestätigung für das Löschen mehrerer ausgewählter Einträge.
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return

    openConfirmDialog('Sicher? Möchtest du alle ausgewählten Einträge wirklich löschen?', () => {
      setEntries((current) => current.filter((entry) => !selectedIds.includes(entry.id)))
      setSelectedIds([])
    })
  }

  // Ändert die Sortierreihenfolge für die Tabelle.
  // Klickt man mehrfach, wechselt die Richtung zwischen auf- und absteigend.
  const handleSort = (key) => {
    setSortConfig((current) =>
      current.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    )
  }

  // Erzeugt aggregierte Statusdaten für die Übersicht und Farbdarstellung.
  const statusData = useMemo(() => {
    return statusOptions.map((status) => ({
      status,
      count: entries.filter((entry) => entry.status === status).length,
      color: statusColors[status],
      label: statusLabels[status],
    }))
  }, [entries])

  // Erzeugt aggregierte Prioritätsdaten für die Übersicht und Farbdarstellung.
  const priorityData = useMemo(() => {
    return priorityOptions.map((priority) => ({
      priority,
      count: entries.filter((entry) => entry.priority === priority).length,
      color: priorityColors[priority],
      label: priorityLabels[priority],
    }))
  }, [entries])

  // Filtert die Einträge basierend auf Suchtext, Status- und Prioritätsfilter.
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesName = entry.name.toLowerCase().includes(searchName.toLowerCase())
      const matchesStatus = filterStatus === 'all' || entry.status === filterStatus
      const matchesPriority = filterPriority === 'all' || entry.priority === filterPriority
      return matchesName && matchesStatus && matchesPriority
    })
  }, [entries, searchName, filterStatus, filterPriority])

  const sortedFilteredEntries = useMemo(() => {
    const comparator = (a, b) => {
      const direction = sortConfig.direction === 'asc' ? 1 : -1
      if (sortConfig.key === 'name') {
        return a.name.localeCompare(b.name) * direction
      }
      if (sortConfig.key === 'status') {
        return (sortOrder.status[a.status] - sortOrder.status[b.status]) * direction
      }
      if (sortConfig.key === 'priority') {
        return (sortOrder.priority[a.priority] - sortOrder.priority[b.priority]) * direction
      }
      if (sortConfig.key === 'lastModified') {
        const parseDate = (value) => {
          const match = value.match(/^(\d{2})\.(\d{2})\.(\d{2}) (\d{2}):(\d{2})$/)
          if (!match) return 0
          const [, day, month, year, hours, minutes] = match
          return new Date(
            2000 + Number(year),
            Number(month) - 1,
            Number(day),
            Number(hours),
            Number(minutes),
          ).getTime()
        }
        return (parseDate(a.lastModified) - parseDate(b.lastModified)) * direction
      }
      return 0
    }

    return [...filteredEntries].sort(comparator)
  }, [filteredEntries, sortConfig])

  // Anzahl der Seiten für die Seitennavigation.
  const pageCount = pageSize === 0 ? 1 : Math.max(1, Math.ceil(sortedFilteredEntries.length / pageSize))

  // Ermittelt die Einträge für die aktuell sichtbare Seite.
  const paginatedEntries = useMemo(() => {
    if (pageSize === 0) return sortedFilteredEntries
    const start = (currentPage - 1) * pageSize
    return sortedFilteredEntries.slice(start, start + pageSize)
  }, [sortedFilteredEntries, currentPage, pageSize])

  // IDs der sichtbaren Einträge auf der aktuellen Seite.
  const currentPageIds = paginatedEntries.map((entry) => entry.id)
  const isAllPageSelected = currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.includes(id))

  // Wählt alle Einträge auf der aktuell sichtbaren Seite aus oder hebt die Auswahl auf.
  const toggleSelectPage = () => {
    setSelectedIds((current) => {
      if (isAllPageSelected) {
        return current.filter((id) => !currentPageIds.includes(id))
      }
      const merged = [...current]
      currentPageIds.forEach((id) => {
        if (!merged.includes(id)) merged.push(id)
      })
      return merged
    })
  }

  // Korrigiert die aktuelle Seite, falls das Filtern oder die Seitengröße
  // dazu geführt hat, dass die Seite außerhalb des gültigen Bereichs liegt.
  useEffect(() => {
    if (currentPage > pageCount) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentPage(pageCount)
    }
  }, [currentPage, pageCount])

  const totalEntries = entries.length
  const statusGradient = useMemo(() => {
    const segments = []
    let current = 0

    statusData.forEach(({ count, color }) => {
      if (count === 0) return
      const percentage = (count / Math.max(totalEntries, 1)) * 100
      segments.push(`${color} ${current}% ${current + percentage}%`)
      current += percentage
    })

    if (segments.length === 0) {
      return '#e5e7eb'
    }

    return `conic-gradient(${segments.join(', ')})`
  }, [statusData, totalEntries])

  const priorityGradient = useMemo(() => {
    const segments = []
    let current = 0

    priorityData.forEach(({ count, color }) => {
      if (count === 0) return
      const percentage = (count / Math.max(totalEntries, 1)) * 100
      segments.push(`${color} ${current}% ${current + percentage}%`)
      current += percentage
    })

    if (segments.length === 0) {
      return '#e5e7eb'
    }

    return `conic-gradient(${segments.join(', ')})`
  }, [priorityData, totalEntries])

  // Liefert einen Zeitstempel für die letzte Änderung eines Eintrags.
  const updateLastModified = () => formatDate(new Date())

  // Aktualisiert das Formular für neuen Einträge.
  const handleFormChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  // Aktualisiert das Bearbeitungsformular für einen vorhandenen Eintrag.
  const handleEditChange = (event) => {
    const { name, value } = event.target
    setEditData((current) => ({ ...current, [name]: value }))
  }

  // Öffnet das Modal zum Erstellen eines neuen Eintrags.
  const openCreateModal = () => setShowCreateModal(true)

  // Schließt das Erstellungsmodal und setzt das Eingabeformular zurück.
  const closeCreateModal = () => {
    setShowCreateModal(false)
    setFormData({ name: '', status: 'waiting', priority: 'medium' })
  }

  // Legt einen neuen Eintrag an, wenn das Formular gültig ist.
  const handleCreateEntry = (event) => {
    event.preventDefault()
    const trimmedName = formData.name.trim()
    if (!trimmedName) return

    setEntries((current) => [
      ...current,
      {
        id: nextId,
        name: trimmedName,
        status: formData.status,
        priority: formData.priority,
        lastModified: updateLastModified(),
      },
    ])
    setNextId((id) => id + 1)
    closeCreateModal()
  }

  // Löscht einen einzelnen Eintrag nach Bestätigung
  const handleDeleteEntry = (id) => {
    openConfirmDialog('Sicher? Möchtest du diesen Eintrag wirklich löschen?', () => {
      setEntries((current) => current.filter((entry) => entry.id !== id))
      if (editingId === id) {
        setEditingId(null)
      }
    })
  }

  // Speichert die aktuellen Einträge bei jeder Änderung im Local Storage.
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  }, [entries])

  // Startet den Bearbeitungsmodus für einen bestimmten Eintrag.
  const startEditing = (entry) => {
    setEditingId(entry.id)
    setEditData({
      name: entry.name,
      status: entry.status,
      priority: entry.priority,
    })
  }

  // Bricht den Bearbeitungsmodus ab, ohne Änderungen zu speichern.
  const cancelEditing = () => {
    setEditingId(null)
  }

  // Speichert die geänderten Werte des Eintrags und aktualisiert den Zeitstempel.
  const saveEditing = (id) => {
    if (!editData.name.trim()) return

    setEntries((current) =>
      current.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              name: editData.name.trim(),
              status: editData.status,
              priority: editData.priority,
              lastModified: updateLastModified(),
            }
          : entry,
      ),
    )
    setEditingId(null)
  }
    return (
      <AppView
        {...{
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
        }}
      />
    )
  }

  export default App;
