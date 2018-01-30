import sys
import json
from docutils.parsers.rst.directives.body import CodeBlock

from os.path import basename
from StringIO import StringIO

from sphinx.util.compat import Directive
from docutils import nodes

class subst_code_block(nodes.Admonition, nodes.Element):
    pass

def visit_subst_code_block_node(self, node):
    self.visit_admonition(node)

def depart_subst_code_block_node(self, node):
    self.depart_admonition(node)

def subst(s, code_subs):
    for i in code_subs.keys():
        print '|{}|'.format(i) + " : " + code_subs[i]
        s = s.replace('|{}|'.format(i), code_subs[i])
    return s

class SubstCodeBlock(CodeBlock):
    """Execute the specified python code and insert the output into the document"""
    has_content = True

    def run(self):
    	env = self.state.document.settings.env
        # (source, line) = self.state.state_machine.get_source_and_line(self.lineno)
        for i, s in enumerate(self.content):
            self.content[i] = subst(s, env.app.config.code_substitutions)
            print self.content[i]
        return super (SubstCodeBlock, self).run()

#        targetid = "todo-%d" % env.new_serialno('todo')
#        targetnode = nodes.target('', '', ids=[targetid])
#
#        text = str(self.state.document.substitution_defs)
#        text += "\n names: " + json.dumps(self.state.document.substitution_names)
#	node = subst_code_block(text);
#        return [targetnode, subst_code_block]

def setup(app):
    app.add_config_value('code_substitutions', {}, 'html')
    app.add_directive('subst-code-block', SubstCodeBlock)

