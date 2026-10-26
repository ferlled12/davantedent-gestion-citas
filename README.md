# 🦷 DavanteDent - Gestión Local de Citas

Proyecto académico para el módulo **Desarrollo Web en Entorno Cliente** (Grado Superior en Desarrollo de Aplicaciones Web). 

## 📋 Descripción
Aplicación web diseñada para la gestión de citas de clínicas dentales franquiciadas. Cumple con el requisito estricto de **no compartir datos entre sedes**, utilizando el almacenamiento persistente del navegador del cliente en lugar de bases de datos externas.

## 🚀 Características principales
- **Persistencia local:** uso intensivo de `localStorage` y transformaciones JSON para el guardado de datos.
- **Validación avanzada:** expresiones regulares (RegEx) para validar formatos de DNI español y números de teléfono.
- **Seguridad en la edición:** carga de datos directamente desde la memoria persistente mediante identificadores ocultos (`type="hidden"`), ignorando el DOM para evitar manipulaciones.
- **Prevención de pérdida de datos:** Control del evento `submit` con `e.preventDefault()` para evitar recargas indeseadas y mantener la información del usuario en caso de error.

## 🛠️ Tecnologías utilizadas
- **HTML5**
- **CSS3**
- **JavaScript**
