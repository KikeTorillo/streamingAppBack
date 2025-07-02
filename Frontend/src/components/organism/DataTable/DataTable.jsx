// ===== DATA TABLE ORGANISM - CON COMPONENTES BUTTON =====
// src/components/organism/DataTable/DataTable.jsx

import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';

// Componentes del sistema de diseño
import { Button } from '../../atoms/Button/Button';
import { TextInput } from '../../molecules/TextInput/TextInput';
import { Select } from '../../atoms/Select/Select';
import { EmptyState } from '../../molecules/EmptyState/EmptyState';
import { ActionsDropdown } from '../../molecules/ActionsDropdown/ActionsDropdown';

import './DataTable.css';

// Hook personalizado para debounce
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [debouncedValue];
}

/**
 * DataTable - Organismo completo para mostrar datos tabulares
 * 
 * ✅ SISTEMA DE DISEÑO: Usa componente Button para todos los botones
 * ✅ CONSISTENCIA: Headers, paginación y acciones con mismo estilo
 * ✅ STORYBOOK: Solo componentes con stories
 */
function DataTable({
  // Props de datos
  data = [],
  columns = [],

  // Props de estado
  loading = false,
  error = null,
  deleting = null, // ID del elemento siendo eliminado

  // Props de acciones
  showActions = true,
  onEdit,
  onDelete,
  onView,
  actionsColumnHeader = 'Acciones',

  // Props de búsqueda y paginación
  searchable = true,
  searchPlaceholder = 'Buscar...',
  pageSize = 25,
  pageSizeOptions = [10, 25, 50, 100],
  defaultPageSize = 25,

  // Props de estados vacíos
  emptyTitle = 'No hay datos',
  emptyDescription = 'No se encontraron resultados',
  emptyIcon = "📋",
  emptyAction = null,

  // ✅ AGREGAR emptyMessage COMO PROP VÁLIDA
  emptyMessage, // ← PROP PERSONALIZADA (causa el error)

  // Props de customización
  className = '',
  variant = 'default', // 'default' | 'striped' | 'bordered' | 'compact'

  // ✅ SEPARAR PROPS ADICIONALES PERSONALIZADAS QUE PODRÍAN CAUSAR ERRORES
  pagination, // ← PROP PERSONALIZADA (objeto de configuración)
  onRefresh, // ← PROP PERSONALIZADA (handler)
  rowClassName, // ← ✅ AGREGAR ESTA LÍNEA
  ...restProps
}) {

  // ✅ FILTRAR PROPS QUE NO DEBEN IR AL DOM
  const {
    // Props de datos (personalizadas)
    data: _data,
    columns: _columns,

    // Props de estado (personalizadas)
    loading: _loading,
    error: _error,
    deleting: _deleting,

    // Props de acciones (personalizadas)
    showActions: _showActions,
    onEdit: _onEdit,
    onDelete: _onDelete,
    onView: _onView,
    actionsColumnHeader: _actionsColumnHeader,

    // Props de búsqueda y paginación (personalizadas)
    searchable: _searchable,
    searchPlaceholder: _searchPlaceholder,
    pageSize: _pageSize,
    pageSizeOptions: _pageSizeOptions,
    defaultPageSize: _defaultPageSize,

    // Props de estados vacíos (personalizadas)
    emptyTitle: _emptyTitle,
    emptyDescription: _emptyDescription,
    emptyIcon: _emptyIcon,
    emptyAction: _emptyAction,
    emptyMessage: _emptyMessage, // ✅ FILTRAR ESTA PROP PROBLEMÁTICA

    // Props de customización (personalizadas)
    variant: _variant,

    // Props adicionales personalizadas
    emptyState: _emptyState,      // ← AGREGAR ESTA
    pagination: _pagination,
    onRefresh: _onRefresh,
    rowClassName: _rowClassName,
    ...domProps // ✅ Solo props válidas para el DOM
  } = restProps;

  // ===== LÓGICA PARA MANEJAR emptyMessage =====
  // Si se pasa emptyMessage, usarlo como emptyDescription
  const finalEmptyDescription = emptyMessage || emptyDescription;

  // ===== ESTADOS =====
  const [globalFilter, setGlobalFilter] = useState('');
  const [currentPageSize, setCurrentPageSize] = useState(pageSize || defaultPageSize);

  // Debounce para búsqueda
  const [debouncedGlobalFilter] = useDebounce(globalFilter, 300);

  // ===== COLUMNA DE ACCIONES =====
  const actionColumn = useMemo(() => {
    if (!showActions || (!onEdit && !onDelete && !onView)) return null;

    return {
      id: 'actions',
      header: actionsColumnHeader,
      size: 120,
      enableSorting: false,
      cell: ({ row }) => {
        const rowData = row.original;
        const isDeleting = deleting === rowData.id;

        const actions = [];

        if (onView) {
          actions.push({
            label: 'Ver',
            icon: '👁️',
            onClick: () => onView(rowData),
            variant: 'ghost'
          });
        }

        if (onEdit) {
          actions.push({
            label: 'Editar',
            icon: '✏️',
            onClick: () => onEdit(rowData),
            variant: 'outline'
          });
        }

        if (onDelete) {
          actions.push({
            label: isDeleting ? 'Eliminando...' : 'Eliminar',
            icon: isDeleting ? '⏳' : '🗑️',
            onClick: () => onDelete(rowData),
            variant: 'danger',
            disabled: isDeleting,
            loading: isDeleting
          });
        }

        return (
          <div className="data-table__actions">
            <ActionsDropdown
              actions={actions}
              variant="outline"
              size="sm"
              disabled={loading}
            />
          </div>
        );
      }
    };
  }, [showActions, onEdit, onDelete, onView, actionsColumnHeader, deleting, loading]);

  // ===== MEMOIZED COLUMNS =====
  const memoColumns = useMemo(() => {
    const baseColumns = columns || [];
    return actionColumn ? [...baseColumns, actionColumn] : baseColumns;
  }, [columns, actionColumn]);

  // ===== CONFIGURACIÓN DE TABLA =====
  const table = useReactTable({
    data: data || [],
    columns: memoColumns,
    state: {
      globalFilter: debouncedGlobalFilter,
      pagination: {
        pageIndex: 0,
        pageSize: currentPageSize,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // ===== ACTUALIZAR TAMAÑO DE PÁGINA =====
  React.useEffect(() => {
    table.setPageSize(currentPageSize);
  }, [currentPageSize, table]);

  // ===== RENDER DE ESTADO VACÍO =====
  if (!loading && (!data || data.length === 0) && !debouncedGlobalFilter) {
    return (
      <div
        className={`data-table data-table--empty data-table--${variant} ${className}`}
        {...domProps} // ✅ Solo props válidas del DOM
      >
        <div className="data-table__empty">
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            description={finalEmptyDescription} // ✅ Usar emptyMessage si está disponible
            action={emptyAction}
          />
        </div>
      </div>
    );
  }

  // ===== RENDER PRINCIPAL =====
  return (
    <div
      className={`data-table data-table--${variant} ${className}`}
      {...domProps} // ✅ Solo props válidas del DOM
    >
      {/* ===== CONTROLES SUPERIORES ===== */}
      {searchable && (
        <div className="data-table__controls">
          {/* Búsqueda */}
          <div className="data-table__search">
            <TextInput
              placeholder={searchPlaceholder}
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              leftIcon="🔍"
              size="sm"
              disabled={loading}
            />
          </div>

          {/* Selector de tamaño de página */}
          <div className="data-table__page-size">
            <Select
              value={currentPageSize}
              onChange={(e) => setCurrentPageSize(Number(e.target.value))}
              size="sm"
              disabled={loading}
              options={pageSizeOptions.map(size => ({
                value: size,
                label: `${size} filas`
              }))}
              placeholder="Tamaño"
            />
          </div>
        </div>
      )}

      {/* ===== TABLA ===== */}
      <div className="data-table__container">
        <table className="data-table__table">
          {/* ===== HEADER CON COMPONENTE BUTTON ===== */}
          <thead className="data-table__thead">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="data-table__header-row">
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className={`data-table__th ${header.column.getCanSort() ? 'data-table__th--sortable' : ''
                      }`}
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      header.column.getCanSort() ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={header.column.getToggleSortingHandler()}
                          className="data-table__sort-button"
                          disabled={loading}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <span className="data-table__sort-icon">
                            {{
                              asc: ' ▲',
                              desc: ' ▼',
                            }[header.column.getIsSorted()] ?? ' ↕️'}
                          </span>
                        </Button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {/* ===== BODY ===== */}
          <tbody className="data-table__tbody">
            {loading ? (
              // Estados de loading
              Array.from({ length: currentPageSize }).map((_, index) => (
                <tr key={`loading-${index}`} className="data-table__row data-table__row--loading">
                  {memoColumns.map((_, colIndex) => (
                    <td key={`loading-cell-${colIndex}`} className="data-table__td">
                      <div className="data-table__skeleton"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : error ? (
              // Estado de error
              <tr className="data-table__row data-table__row--error">
                <td colSpan={memoColumns.length} className="data-table__td">
                  <div className="data-table__error">
                    <span className="data-table__error-icon">⚠️</span>
                    <span className="data-table__error-message">{error}</span>
                    {onRefresh && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onRefresh}
                        className="data-table__retry-button"
                      >
                        Reintentar
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              // Sin resultados de búsqueda
              <tr className="data-table__row data-table__row--empty">
                <td colSpan={memoColumns.length} className="data-table__td">
                  <div className="data-table__no-results">
                    <span className="data-table__no-results-icon">🔍</span>
                    <span className="data-table__no-results-message">
                      No se encontraron resultados para "{debouncedGlobalFilter}"
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              // Filas normales
              table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  className={`data-table__row ${deleting === row.original.id ? 'data-table__row--deleting' : ''
                    }`}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="data-table__td">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ===== PAGINACIÓN CON COMPONENTE BUTTON ===== */}
      {!loading && !error && data.length > 0 && (
        <div className="data-table__pagination">
          <div className="data-table__pagination-info">
            <span className="data-table__pagination-text">
              Mostrando {table.getState().pagination.pageIndex * currentPageSize + 1} a{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * currentPageSize,
                table.getFilteredRowModel().rows.length
              )}{' '}
              de {table.getFilteredRowModel().rows.length} resultados
            </span>
          </div>

          <div className="data-table__pagination-controls">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="data-table__pagination-button"
            >
              ⏮️ Primero
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="data-table__pagination-button"
            >
              ◀️ Anterior
            </Button>

            <span className="data-table__pagination-current">
              Página {table.getState().pagination.pageIndex + 1} de{' '}
              {table.getPageCount()}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="data-table__pagination-button"
            >
              Siguiente ▶️
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="data-table__pagination-button"
            >
              Último ⏭️
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export { DataTable };