import { Link } from "react-router-dom"
const favorites:any[]=[]; const fmt=(x:any)=>x; const handleRemoveFavorite=(id:string)=>{}; const handleAddToCart=(item:any)=>{}; const removingId:any=null;
function Test(){ return (<>
								{favorites.map((item) => {
								const itemId = item._id?.toString() ?? item.id?.toString() ?? '';
								const productLink = `/shop/product/${item.slug ?? itemId}`;
								return (
									<div key={itemId} className="page-card" style={{
										opacity: !item.inStock ? 0.6 : 1,
										display: 'flex',
										flexDirection: 'column',
										padding: '1.5rem'
									}}>
										<Link to={productLink} style={{ display: 'block', marginBottom: '1rem' }}>
											<img
												src={item.images?.[0] || item.image || '/api/placeholder/300/300'}
												alt={item.name || 'Produto favorito'}
												style={{ width: '100%', borderRadius: 12, objectFit: 'cover', minHeight: 180 }}
											/>
										</Link>
										<div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>{item.category}</div>
										<h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1rem', lineHeight: 1.3 }}>
											<Link to={productLink} style={{ color: 'inherit', textDecoration: 'none' }}>{item.name}</Link>
										</h3>
										<div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1rem' }}>
											Adicionado em {item.dateAdded || '—'}
										</div>
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', marginTop: 'auto' }}>
											<div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ec4899' }}>{fmt(Number(item.price ?? item.currentPrice ?? 0) || 0)}</div>
											{!item.inStock && (
												<span style={{
													background: '#fee2e2',
													color: '#991b1b',
													padding: '0.3rem 0.6rem',
													borderRadius: '4px',
													fontSize: '0.75rem',
													fontWeight: 600
												}}
												>
													Indisponível
												</span>
											)}
										</div>
										<div style={{ display: 'flex', gap: 10, flexDirection: 'column' }}>
											    <button
											        onClick={() => handleRemoveFavorite(itemId)} disabled={removingId === itemId}
											        style={{
											            width: '100%',
											            padding: '10px',
											            background: 'transparent',
											            color: '#ec4899',
											            border: '1px solid #ec4899',
											            borderRadius: '6px',
											            fontSize: '0.85rem',
											            fontWeight: 700,
											            cursor: removingId === itemId ? 'not-allowed' : 'pointer'
											        }}
											    >
											        Remover dos Favoritos
											    </button>
											    <button
											        onClick={() => handleAddToCart(item)}
											        disabled={!item.inStock}
											        style={{
											            width: '100%',
											            padding: '10px',
											            background: item.inStock ? '#ec4899' : '#d1d5db',
											            color: 'white',
											            border: 'none',
											            borderRadius: '6px',
											            fontSize: '0.9rem',
											            fontWeight: 600,
											            cursor: item.inStock ? 'pointer' : 'not-allowed'
											        }}
											    >
											        Adicionar ao Carrinho
											    </button>
											</div>
									</div>
								})}
</>); }
