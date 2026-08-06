import { useCallback, useEffect, useMemo, useState } from 'react'
import { formatDate } from '../utils/date'
import { generateDummyEntries, loadStoredEntries, saveEntries } from '../utils/storage'
import { compareEntries } from '../utils/sort'
import { computeConicGradient } from '../utils/visuals'

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
const priorityOptions = ['low', 'medium', 'high']
const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}
const priorityColors = {
  low: '#16a34a',
  medium: '#f59e0b',
  high: '#ef4444',
}

// Set to true to generate 300 dummy entries
// When false, no dummy entries are generated
const enableDummyData = false
const defaultEntries = generateDummyEntries(300)

export function useEntries() {
  const initialEntries = enableDummyData ? defaultEntries : loadStoredEntries([])
  const [entries, setEntries] = useState(() => initialEntries)
  // Initialisiert die nächste ID anhand der geladenen Einträge.
  const [nextId, setNextId] = useState(() => {
    const maxId = initialEntries.reduce((max, entry) => Math.max(max, entry.id), 0)
    return maxId + 1
  })
  const [formData, setFormData] = useState({
    name: '',
    status: 'waiting',
    priority: 'medium',
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState({
    visible: false,
    message: '',
    onConfirm: null,
  })
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({
    name: '',
    status: 'waiting',
    priority: 'medium',
  })
  const [searchName, setSearchName] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])

  const resetFilters = useCallback(() => {
    setSearchName('')
    setFilterStatus('all')
    setFilterPriority('all')
    setCurrentPage(1)
    setSelectedIds([])
  }, [])

  const toggleSelectionMode = useCallback(() => {
    setSelectionMode((current) => {
      if (current) {
        setSelectedIds([])
      }
      return !current
    })
  }, [])

  const handleSelectEntry = useCallback((id) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id],
    )
  }, [])

  const openConfirmDialog = useCallback((message, onConfirm) => {
    setConfirmDialog({ visible: true, message, onConfirm })
  }, [])

  const closeConfirmDialog = useCallback(() => {
    setConfirmDialog({ visible: false, message: '', onConfirm: null })
  }, [])

  const handleConfirmDialog = useCallback(() => {
    if (confirmDialog.onConfirm) confirmDialog.onConfirm()
    closeConfirmDialog()
  }, [confirmDialog, closeConfirmDialog])

  const handleDeleteSelected = useCallback(() => {
    if (selectedIds.length === 0) return

    openConfirmDialog('Sicher? Möchtest du alle ausgewählten Einträge wirklich löschen?', () => {
      setEntries((current) => current.filter((entry) => !selectedIds.includes(entry.id)))
      setSelectedIds([])
    })
  }, [selectedIds, openConfirmDialog])

  const handleSort = useCallback((key) => {
    setSortConfig((current) =>
      current.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    )
  }, [])

  const statusData = useMemo(
    () =>
      statusOptions.map((status) => ({
        status,
        count: entries.filter((entry) => entry.status === status).length,
        color: statusColors[status],
        label: statusLabels[status],
      })),
    [entries],
  )

  const priorityData = useMemo(
    () =>
      priorityOptions.map((priority) => ({
        priority,
        count: entries.filter((entry) => entry.priority === priority).length,
        color: priorityColors[priority],
        label: priorityLabels[priority],
      })),
    [entries],
  )

  const filteredEntries = useMemo(
    () =>
      entries.filter((entry) => {
        const matchesName = entry.name.toLowerCase().includes(searchName.toLowerCase())
        const matchesStatus = filterStatus === 'all' || entry.status === filterStatus
        const matchesPriority = filterPriority === 'all' || entry.priority === filterPriority
        return matchesName && matchesStatus && matchesPriority
      }),
    [entries, searchName, filterStatus, filterPriority],
  )

  const sortedFilteredEntries = useMemo(
    () => [...filteredEntries].sort((a, b) => compareEntries(a, b, sortConfig)),
    [filteredEntries, sortConfig],
  )

  const pageCount = pageSize === 0 ? 1 : Math.max(1, Math.ceil(sortedFilteredEntries.length / pageSize))

  // Normalisiert den aktuellen Seitenindex, so dass er immer im gültigen Bereich bleibt.
  // Das verhindert fehlerhafte Seite-Nummern, wenn Filter oder Seitengröße die Gesamtseitenzahl ändern.
  const normalizedCurrentPage = Math.min(Math.max(currentPage, 1), pageCount)

  const paginatedEntries = useMemo(() => {
    if (pageSize === 0) return sortedFilteredEntries
    const start = (normalizedCurrentPage - 1) * pageSize
    return sortedFilteredEntries.slice(start, start + pageSize)
  }, [sortedFilteredEntries, normalizedCurrentPage, pageSize])

  const currentPageIds = paginatedEntries.map((entry) => entry.id)

  const isAllPageSelected = currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.includes(id))

  const toggleSelectPage = useCallback(() => {
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
  }, [currentPageIds, isAllPageSelected])

  const totalEntries = entries.length
  const statusGradient = useMemo(() => computeConicGradient(statusData, totalEntries), [statusData, totalEntries])
  const priorityGradient = useMemo(() => computeConicGradient(priorityData, totalEntries), [priorityData, totalEntries])

  const updateLastModified = useCallback(() => formatDate(new Date()), [])

  const handleFormChange = useCallback((event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }, [])

  const handleEditChange = useCallback((event) => {
    const { name, value } = event.target
    setEditData((current) => ({ ...current, [name]: value }))
  }, [])

  const openCreateModal = useCallback(() => setShowCreateModal(true), [])

  const closeCreateModal = useCallback(() => {
    setShowCreateModal(false)
    setFormData({ name: '', status: 'waiting', priority: 'medium' })
  }, [])

  const handleCreateEntry = useCallback(
    (event) => {
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
    },
    [closeCreateModal, formData, nextId, updateLastModified],
  )

  const handleDeleteEntry = useCallback(
    (id) => {
      openConfirmDialog('Sicher? Möchtest du diesen Eintrag wirklich löschen?', () => {
        setEntries((current) => current.filter((entry) => entry.id !== id))
        if (editingId === id) {
          setEditingId(null)
        }
      })
    },
    [editingId, openConfirmDialog],
  )

  // Speichert die Einträge automatisch im lokalen Storage, sobald sich der Eintragszustand ändert.
  useEffect(() => {
    saveEntries(entries)
  }, [entries])

  const startEditing = useCallback((entry) => {
    setEditingId(entry.id)
    setEditData({
      name: entry.name,
      status: entry.status,
      priority: entry.priority,
    })
  }, [])

  const cancelEditing = useCallback(() => setEditingId(null), [])

  const saveEditing = useCallback(
    (id) => {
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
    },
    [editData, updateLastModified],
  )

  return {
    entries,
    nextId,
    formData,
    showCreateModal,
    confirmDialog,
    editingId,
    editData,
    searchName,
    filterStatus,
    filterPriority,
    sortConfig,
    pageSize,
    currentPage: normalizedCurrentPage,
    selectionMode,
    selectedIds,
    statusOptions,
    statusLabels,
    priorityOptions,
    priorityLabels,
    pageCount,
    totalEntries,
    statusData,
    priorityData,
    statusGradient,
    priorityGradient,
    sortedFilteredEntries,
    paginatedEntries,
    resetFilters,
    toggleSelectionMode,
    handleSelectEntry,
    openConfirmDialog,
    closeConfirmDialog,
    handleConfirmDialog,
    handleDeleteSelected,
    handleSort,
    handleFormChange,
    handleEditChange,
    openCreateModal,
    closeCreateModal,
    handleCreateEntry,
    handleDeleteEntry,
    startEditing,
    cancelEditing,
    saveEditing,
    setSearchName,
    setFilterStatus,
    setFilterPriority,
    setPageSize,
    setCurrentPage,
    toggleSelectPage,
  }
}
