import React, { useState } from 'react';
import {
  Database,
  Plus,
  Package,
  LifeBuoy,
  Briefcase,
  Layers,
  Search,
  Trash2,
  Settings2,
  Sparkles,
  ChevronRight,
  Hash,
  Type,
  DollarSign,
  Star,
  CheckSquare,
  Calendar,
  ListFilter,
  Code
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { CustomObjectDefinition, CustomObjectField } from '../../types';

export const CustomObjectsView: React.FC = () => {
  const { customObjects, addCustomObject, addCustomFieldToObject, addRecordToCustomObject, deleteRecordFromCustomObject, showToast } = useCRM();
  
  const [selectedObjectId, setSelectedObjectId] = useState<string>(customObjects[0]?.id || '');
  const [activeSubTab, setActiveSubTab] = useState<'records' | 'schema'>('records');
  const [searchQuery, setSearchQuery] = useState('');

  // New Object Modal State
  const [isNewObjModalOpen, setIsNewObjModalOpen] = useState(false);
  const [newObjName, setNewObjName] = useState('');
  const [newObjSingular, setNewObjSingular] = useState('');
  const [newObjPlural, setNewObjPlural] = useState('');
  const [newObjDescription, setNewObjDescription] = useState('');
  const [newObjIcon, setNewObjIcon] = useState('Package');

  // New Field Modal State
  const [isNewFieldModalOpen, setIsNewFieldModalOpen] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldType, setFieldType] = useState<CustomObjectField['type']>('text');
  const [fieldOptions, setFieldOptions] = useState('');

  // New Record Modal State
  const [isNewRecordModalOpen, setIsNewRecordModalOpen] = useState(false);
  const [recordFormData, setRecordFormData] = useState<Record<string, any>>({});

  const activeObject = customObjects.find((o) => o.id === selectedObjectId) || customObjects[0];

  const handleCreateObject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObjSingular || !newObjPlural) {
      showToast('Please specify singular and plural object names', 'error');
      return;
    }
    const created = addCustomObject({
      name: newObjSingular,
      singularName: newObjSingular,
      pluralName: newObjPlural,
      icon: newObjIcon,
      description: newObjDescription || `Custom metadata schema for ${newObjPlural}`,
    });
    setSelectedObjectId(created.id);
    setIsNewObjModalOpen(false);
    setNewObjSingular('');
    setNewObjPlural('');
    setNewObjDescription('');
  };

  const handleCreateField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeObject || !fieldLabel || !fieldName) return;

    addCustomFieldToObject(activeObject.id, {
      name: fieldName.toLowerCase().replace(/\s+/g, '_'),
      label: fieldLabel,
      type: fieldType,
      options: fieldType === 'select' ? fieldOptions.split(',').map((s) => s.trim()) : undefined,
    });

    setIsNewFieldModalOpen(false);
    setFieldName('');
    setFieldLabel('');
    setFieldOptions('');
  };

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeObject) return;
    addRecordToCustomObject(activeObject.id, recordFormData);
    setIsNewRecordModalOpen(false);
    setRecordFormData({});
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Package': return Package;
      case 'LifeBuoy': return LifeBuoy;
      case 'Briefcase': return Briefcase;
      default: return Layers;
    }
  };

  const filteredRecords = activeObject?.records.filter((rec) => {
    if (!searchQuery) return true;
    return Object.values(rec).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }) || [];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a0c10] text-[#e1e4ea]">
      {/* Header Banner */}
      <div className="px-6 py-4 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e222d] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d0f14] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-[var(--text-primary,#0f172a)] dark:text-white tracking-tight">ClientumCRM Metadata Studio</h1>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                Custom Objects & Schema
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">
              Define custom data models, extend standard CRM entities, and configure dynamic relational fields.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNewObjModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Custom Object
        </button>
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Sidebar: List of Objects */}
        <div className="w-64 border-r border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e222d] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0c0e14] p-3 flex flex-col gap-2 shrink-0 overflow-y-auto">
          <div className="text-[10px] uppercase font-semibold tracking-wider text-[var(--text-muted)] px-2 pt-1 pb-2">
            Workspace Schema
          </div>

          {customObjects.map((obj) => {
            const Icon = getIconComponent(obj.icon);
            const isSelected = obj.id === selectedObjectId;
            return (
              <button
                key={obj.id}
                onClick={() => setSelectedObjectId(obj.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left text-xs transition-all ${ isSelected ? 'bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1e2330] text-[var(--text-primary,#0f172a)] dark:text-white border border-indigo-500/30 font-semibold shadow-sm' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200 hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#141720]' }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-[var(--text-muted)]'}`} />
                  <div className="min-w-0">
                    <div className="truncate font-medium">{obj.pluralName}</div>
                    <div className="text-[10px] text-[var(--text-muted)] truncate">{obj.records.length} records</div>
                  </div>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-indigo-400 translate-x-0.5' : 'text-[var(--text-secondary)]'}`} />
              </button>
            );
          })}
        </div>

        {/* Right Detail: Records & Schema Editor */}
        {activeObject ? (
          <div className="flex-1 flex flex-col min-w-0 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a0c10] overflow-hidden">
            {/* Object Sub-Header */}
            <div className="px-6 py-3 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e222d] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d0f14] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-2">
                  <span>{activeObject.pluralName}</span>
                  <span className="text-xs font-normal text-[var(--text-muted,#64748b)] dark:text-slate-400">({activeObject.records.length} items)</span>
                </h2>
                <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">{activeObject.description}</p>
              </div>

              {/* Tabs & Quick Actions */}
              <div className="flex items-center gap-3">
                <div className="flex items-center p-0.5 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#141822] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#232838]">
                  <button
                    onClick={() => setActiveSubTab('records')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${ activeSubTab === 'records' ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-sm font-semibold' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
                  >
                    Records ({activeObject.records.length})
                  </button>
                  <button
                    onClick={() => setActiveSubTab('schema')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${ activeSubTab === 'schema' ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-sm font-semibold' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
                  >
                    Schema & Fields ({activeObject.fields.length})
                  </button>
                </div>

                {activeSubTab === 'records' ? (
                  <button
                    onClick={() => setIsNewRecordModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#1a1f2c] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#232a3c] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2e364a] text-[var(--text-primary,#0f172a)] dark:text-slate-200 text-xs font-medium transition-all"
                  >
                    <Plus className="w-3.5 h-3.5 text-blue-400" />
                    New {activeObject.singularName}
                  </button>
                ) : (
                  <button
                    onClick={() => setIsNewFieldModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-medium transition-all"
                  >
                    <Plus className="w-3.5 h-3.5 text-indigo-400" />
                    Add Custom Field
                  </button>
                )}
              </div>
            </div>

            {/* SubTab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeSubTab === 'records' ? (
                <div className="space-y-4">
                  {/* Search bar */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                      <input
                        type="text"
                        placeholder={`Search ${activeObject.pluralName}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#141720] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#222736] text-[var(--text-primary,#0f172a)] dark:text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Table */}
                  <div className="rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e222d] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d0f14] overflow-hidden shadow-lg">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[var(--bg-card,#ffffff)] dark:bg-[#141822] text-[var(--text-muted,#64748b)] dark:text-slate-400 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e222d]">
                          <th className="px-4 py-3 font-semibold">Name / ID</th>
                          {activeObject.fields.map((f) => (
                            <th key={f.id} className="px-4 py-3 font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300">
                              {f.label}
                            </th>
                          ))}
                          <th className="px-4 py-3 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-subtle,#e2e8f0)] dark:divide-[#1e222d]">
                        {filteredRecords.length > 0 ? (
                          filteredRecords.map((rec) => (
                            <tr key={rec.id} className="hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#141722] transition-colors">
                              <td className="px-4 py-3 font-medium text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                                {rec.name || rec.id}
                              </td>
                              {activeObject.fields.map((f) => {
                                const val = rec[f.name];
                                return (
                                  <td key={f.id} className="px-4 py-3 text-[var(--text-secondary,#475569)] dark:text-slate-300">
                                    {f.type === 'boolean' ? (
                                      val ? (
                                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">Yes</span>
                                      ) : (
                                        <span className="px-2 py-0.5 rounded bg-slate-700/50 text-[var(--text-muted,#64748b)] dark:text-slate-400 text-[10px]">No</span>
                                      )
                                    ) : f.type === 'currency' ? (
                                      <span className="font-mono text-emerald-400">${Number(val || 0).toLocaleString()}</span>
                                    ) : f.type === 'rating' ? (
                                      <div className="flex items-center gap-0.5 text-amber-400">
                                        {'★'.repeat(Number(val || 1))}
                                      </div>
                                    ) : (
                                      String(val ?? '—')
                                    )}
                                  </td>
                                );
                              })}
                              <td className="px-4 py-3 text-right">
                                <button
                                  onClick={() => deleteRecordFromCustomObject(activeObject.id, rec.id)}
                                  className="p-1 rounded text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                  title="Delete record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={activeObject.fields.length + 2} className="px-4 py-8 text-center text-[var(--text-muted)]">
                              No records found for this custom object.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* Schema & Fields Tab */
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-950/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-indigo-400" />
                      <div>
                        <h3 className="text-xs font-bold text-indigo-200">ClientumCRM Relational Schema Builder</h3>
                        <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
                          Add custom properties, ratings, selection menus, or link to Companies and Contacts.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeObject.fields.map((field) => (
                      <div
                        key={field.id}
                        className="p-3.5 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e222d] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d0f14] flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#181d28] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3244] flex items-center justify-center text-indigo-400">
                            {field.type === 'currency' ? <DollarSign className="w-4 h-4" /> :
                             field.type === 'number' ? <Hash className="w-4 h-4" /> :
                             field.type === 'rating' ? <Star className="w-4 h-4" /> :
                             field.type === 'boolean' ? <CheckSquare className="w-4 h-4" /> :
                             field.type === 'date' ? <Calendar className="w-4 h-4" /> :
                             field.type === 'select' ? <ListFilter className="w-4 h-4" /> :
                             <Type className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-2">
                              {field.label}
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1e2330] text-[var(--text-muted,#64748b)] dark:text-slate-400">
                                {field.name}
                              </span>
                            </div>
                            <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 capitalize">
                              Type: {field.type} {field.options ? `(${field.options.join(', ')})` : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Modal: Create Custom Object */}
      {isNewObjModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d0f14] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e222d] rounded-2xl shadow-2xl p-6 text-xs text-[var(--text-primary,#0f172a)] dark:text-slate-200">
            <h3 className="text-sm font-bold text-[var(--text-primary,#0f172a)] dark:text-white mb-1 flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-400" />
              Define New Custom Object Schema
            </h3>
            <p className="text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-4">
              Create a custom entity model for your ClientumCRM workspace.
            </p>

            <form onSubmit={handleCreateObject} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Singular Name</label>
                <input
                  type="text"
                  placeholder="e.g. Asset, Project, Order"
                  value={newObjSingular}
                  onChange={(e) => setNewObjSingular(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#141720] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#222736] text-[var(--text-primary,#0f172a)] dark:text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Plural Name</label>
                <input
                  type="text"
                  placeholder="e.g. Assets, Projects, Orders"
                  value={newObjPlural}
                  onChange={(e) => setNewObjPlural(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#141720] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#222736] text-[var(--text-primary,#0f172a)] dark:text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Description</label>
                <textarea
                  placeholder="What is this object used for?"
                  value={newObjDescription}
                  onChange={(e) => setNewObjDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#141720] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#222736] text-[var(--text-primary,#0f172a)] dark:text-white focus:outline-none focus:border-indigo-500 h-20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewObjModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1e2330] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#252c3d] text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md"
                >
                  Create Object
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Field */}
      {isNewFieldModalOpen && activeObject && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d0f14] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e222d] rounded-2xl shadow-2xl p-6 text-xs text-[var(--text-primary,#0f172a)] dark:text-slate-200">
            <h3 className="text-sm font-bold text-[var(--text-primary,#0f172a)] dark:text-white mb-1">Add Field to {activeObject.singularName}</h3>
            <p className="text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-4">Extend metadata schema properties.</p>

            <form onSubmit={handleCreateField} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Field Label</label>
                <input
                  type="text"
                  placeholder="e.g. Serial Number, Unit Price"
                  value={fieldLabel}
                  onChange={(e) => {
                    setFieldLabel(e.target.value);
                    setFieldName(e.target.value.toLowerCase().replace(/\s+/g, '_'));
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#141720] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#222736] text-[var(--text-primary,#0f172a)] dark:text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Field Type</label>
                <select
                  value={fieldType}
                  onChange={(e) => setFieldType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#141720] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#222736] text-[var(--text-primary,#0f172a)] dark:text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="text">Text (String)</option>
                  <option value="number">Number</option>
                  <option value="currency">Currency ($)</option>
                  <option value="select">Dropdown Select</option>
                  <option value="boolean">Boolean (Yes/No)</option>
                  <option value="rating">Rating (Stars)</option>
                  <option value="date">Date</option>
                </select>
              </div>

              {fieldType === 'select' && (
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Options (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Option 1, Option 2, Option 3"
                    value={fieldOptions}
                    onChange={(e) => setFieldOptions(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#141720] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#222736] text-[var(--text-primary,#0f172a)] dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewFieldModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1e2330] text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow-md"
                >
                  Save Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Record */}
      {isNewRecordModalOpen && activeObject && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d0f14] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e222d] rounded-2xl shadow-2xl p-6 text-xs text-[var(--text-primary,#0f172a)] dark:text-slate-200">
            <h3 className="text-sm font-bold text-[var(--text-primary,#0f172a)] dark:text-white mb-1">New {activeObject.singularName} Record</h3>
            <p className="text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-4">Enter values for schema fields.</p>

            <form onSubmit={handleCreateRecord} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Name / Title</label>
                <input
                  type="text"
                  required
                  onChange={(e) => setRecordFormData({ ...recordFormData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#141720] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#222736] text-[var(--text-primary,#0f172a)] dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {activeObject.fields.map((f) => (
                <div key={f.id}>
                  <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">{f.label}</label>
                  {f.type === 'select' ? (
                    <select
                      onChange={(e) => setRecordFormData({ ...recordFormData, [f.name]: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#141720] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#222736] text-[var(--text-primary,#0f172a)] dark:text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="">Select option...</option>
                      {f.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : f.type === 'boolean' ? (
                    <input
                      type="checkbox"
                      onChange={(e) => setRecordFormData({ ...recordFormData, [f.name]: e.target.checked })}
                      className="w-4 h-4 accent-indigo-500 rounded"
                    />
                  ) : (
                    <input
                      type={f.type === 'number' || f.type === 'currency' ? 'number' : 'text'}
                      onChange={(e) => setRecordFormData({ ...recordFormData, [f.name]: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#141720] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#222736] text-[var(--text-primary,#0f172a)] dark:text-white focus:outline-none focus:border-indigo-500"
                    />
                  )}
                </div>
              ))}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewRecordModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1e2330] text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow-md"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
